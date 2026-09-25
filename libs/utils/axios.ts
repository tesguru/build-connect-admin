// axios.ts
import Axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { decryptData, encryptData } from "./cryptohelper";
import { useAuthStore } from "../store/Authstore";

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: "https://buildconnect-admin-api.ivantage.africa/v1/",
  timeout: 60000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const encryptedSession = sessionStorage.getItem("authToken");
      if (encryptedSession) {
        const token = await decryptData(encryptedSession);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Refresh Token Queue Logic ────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite retry loops
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // ── Call your refresh token endpoint directly (no hook needed) ──
        const encryptedRefreshToken = sessionStorage.getItem("refreshToken");
        if (!encryptedRefreshToken) throw new Error("No refresh token found");

        const refreshToken = await decryptData(encryptedRefreshToken);

        const { data } = await Axios.post(
          "https://admin-buildconnect.ivantage.africa/v1/auth/refresh-token",
          { refreshToken }
        );

        const newAccessToken: string = data?.data.authToken;
        const newRefreshToken: string = data?.data?.refreshToken;

        const encryptedAccess = await encryptData(newAccessToken);
        const encryptedRefresh = await encryptData(newRefreshToken);
        sessionStorage.setItem("authToken", encryptedAccess);
        sessionStorage.setItem("refreshToken", encryptedRefresh);

      

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
     
        processQueue(refreshError, null);

        const { clearAuthData } = useAuthStore.getState();
        clearAuthData();
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("refreshToken");
        window.location.href = "/";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // if (error.response?.status === 500) {
    //   const { clearAuthData } = useAuthStore.getState();
    //   clearAuthData();
    //   window.location.href = "/";
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;