import { APIURLS } from "../constants/apiurl";
import axiosInstance from "../utils/axios.ts";




export const AuthService = {
  login: (data: any) => axiosInstance.post(APIURLS.AUTH.LOGIN, data),
  signup: (data: any) => axiosInstance.post(APIURLS.AUTH.REGISTER, data),
   forgotpassword:(data: any) => axiosInstance.post(APIURLS.AUTH.FORGOT_PASSWORD, data),
   resendotp:(data: any) => axiosInstance.post(APIURLS.AUTH.RESENDOTP, data),
   requestotp:(data: any) => axiosInstance.post(APIURLS.AUTH.VERIFYOTP, data),
  resetpassword:(data: any) => axiosInstance.post(APIURLS.AUTH.CHANGEPASSWORD, data),
    refreshtoken:(data: any) => axiosInstance.post(APIURLS.AUTH.REFRESHTOKEN, data),
};