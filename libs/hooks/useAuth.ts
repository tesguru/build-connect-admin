import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from './usetoast';
import { useAuthStore } from '../store/Authstore';
import { AuthService } from '../services/AuthServices';
import { handleApiError } from '../utils/handleapierror';
import { URLS } from '../constants/pageurl';
import { encryptUrl } from '../utils/helpers';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {setAuthData, clearAuthData} = useAuthStore();
const { toast } = useToast();
  const loginMutation = useMutation({
  mutationFn: AuthService.login,
  onSuccess: (res: any) => {
    const loginData = res?.data;
 
if (loginData.statusCode === 200) {
  const { authToken, refreshToken, user } = loginData.data;
  setAuthData(authToken, refreshToken, user);
  toast.success("Success", "Login Successful");
    router.push("/dashboard");
}

  },
  onError: (error: any) => {
     handleApiError(error, "Login", toast);
  }
});
 const registerMutation = useMutation({
  mutationFn: AuthService.signup,
  onSuccess: (data: any) => {
    const registerData = data?.data;
   if (registerData?.statusCode === 201) {
  toast.success("Success", "Account Created Successfully");
       router.push(URLS.AUTH.LOGIN);
 }
  },
  onError: (error: any) => {
     handleApiError(error, "Sign Up", toast);
  }
});
 const forgotPasswordMutation = useMutation({
  mutationFn: AuthService.forgotpassword,
  onSuccess: (data: any, submittedData :any) => {
     const sentPassword = data?.data;
   if (sentPassword?.statusCode === 200) {
  toast.success("Success", "Otp sent successfully");
   router.push(`${URLS.AUTH.VERIFY_OTP}?email=${encodeURIComponent(submittedData.email)}`);
 }
  },
  onError: (error: any) => {
     handleApiError(error, "Forgot Password", toast);
  }
});


 const resendOtpMutation = useMutation({
  mutationFn: AuthService.resendotp,
  onSuccess: (data: any) => {
      const resendOtp = data?.data;
  if (resendOtp?.statusCode === 200) {
  toast.success("Success", "Otp Sent Sucessfully");
 }
  },
  onError: (error: any) => {
     handleApiError(error, "An error occured", toast);
  }
});

 const resetPasswordMutation = useMutation({
  mutationFn: AuthService.resetpassword,
  onSuccess: (data: any) => {
      const resetPassword = data?.data;
   if (resetPassword?.statusCode === 200) {
  toast.success("Success", "Password reset sucessful");
  router.push(URLS.AUTH.LOGIN)
 }
  },
  onError: (error: any) => {
     handleApiError(error, "An error occured", toast);
  }
});
 const refreshTokenMutation = useMutation({
  mutationFn: AuthService.refreshtoken,
  onSuccess: (data: any) => {
      const refreshToken = data?.data;
   if (refreshToken?.statusCode === 200) {
  toast.success("Success", "Token refresh sucessfully");
  router.push(URLS.AUTH.LOGIN)
 }
  },
  onError: (error: any) => {
     handleApiError(error, "An error occured", toast);
  }
});
  const verifyOtpMutation = useMutation({
    mutationFn: AuthService.requestotp,
    onSuccess: (data:any, submittedData :any) => { 
  const verifyOtp = data?.data;
   if (verifyOtp?.statusCode === 200) {
  toast.success("Success", "Otp Verfied Sucessfully");
router.push(
  `${URLS.AUTH.CREATE_NEW_PASSWORD}?token=${encryptUrl(JSON.stringify({
    email: submittedData.email,
    otp: submittedData.otp,
  }))}`
);
 }
    },
      onError: (error: any) => {
     handleApiError(error, "An error occured", toast);
  }
  });

  // The API has no logout route, so logging out is a local session clear.
  const logout = () => {
    clearAuthData();
    queryClient.clear();
    router.replace(URLS.AUTH.LOGIN);
  };

  return { 
    loginMutation, 
    registerMutation, 
    forgotPasswordMutation,
    verifyOtpMutation,
    resendOtpMutation,
    logout,
    resetPasswordMutation,
    refreshTokenMutation
   };
};