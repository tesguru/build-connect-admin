
import Axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { decryptData, encryptData } from "./cryptohelper";
import { useAuthStore } from "../store/Authstore";

const BASE_URL = "https://buildconnect-admin-api.ivantage.africa/v1/";
const REFRESH_URL = `${BASE_URL}auth/refresh-token`;

// Access tokens live 15 minutes; renew inside the last two rather than letting the next click 401.
const RENEW_SKEW_MS = 2 * 60 * 1000;

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const readSessionToken = async (key: string) => {
  const stored = sessionStorage.getItem(key);
  return stored ? await decryptData(stored) : null;
};

const tokenExpiryMs = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof claims?.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
};

let refreshPromise: Promise<string> | null = null;

// The API rotates the refresh token on every call and rejects the one it replaced, so overlapping
// 401s must share a single in-flight refresh — a second POST with the spent token ends the session.
const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await readSessionToken("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const { data } = await Axios.post(REFRESH_URL, { refreshToken });

      const newAccessToken: string | undefined = data?.data?.authToken;
      const newRefreshToken: string | undefined = data?.data?.refreshToken;
      if (!newAccessToken) throw new Error("Refresh response missing authToken");

      sessionStorage.setItem("authToken", await encryptData(newAccessToken));
      if (newRefreshToken) {
        sessionStorage.setItem("refreshToken", await encryptData(newRefreshToken));
      }
      return newAccessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const endSession = () => {
  useAuthStore.getState().clearAuthData();
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("users");
  window.location.href = "/";
};

// Only the API rejecting the refresh token proves the session is gone. A gateway timeout or a
// 5xx from Cloudflare must fail the request, not sign the admin out.
const isRejectedByServer = (error: unknown) => {
  const status = (error as AxiosError)?.response?.status;
  return status === 401 || status === 403;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;

    let token = await readSessionToken("authToken");
    if (token) {
      const expiresAt = tokenExpiryMs(token);
      if (expiresAt !== null && expiresAt - Date.now() < RENEW_SKEW_MS) {
        token = await refreshAccessToken().catch(() => token);
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableRequest | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (isRejectedByServer(refreshError)) endSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
