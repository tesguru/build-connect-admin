"use client"
import { OTPInput, OTPInputRef } from '@/components/ui/Forms/InputOtp';
import React, { useRef, useState } from 'react';
import Authlayout from '../Authlayout';
import { Capandcaculator } from '@/libs/constants/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/libs/hooks/useAuth';
import { verifyOtpInput, verifyOtpSchema } from '@/libs/schema/authschema';
import Button from '@/components/ui/Button/Button';
import { Spinner } from '@/components/ui/Custom/LoadingState';
import Link from 'next/link';
import { URLS } from '@/libs/constants/pageurl';

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); 
  const [verificationCode, setVerificationCode] = useState<string>('');
  const otpInputRef = useRef<OTPInputRef>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<verifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email || '',
      otp: '',
    },
  });

  const { verifyOtpMutation, resendOtpMutation } = useAuth();

  const handleCodeComplete = (code: string) => {
    setVerificationCode(code);
    setValue('otp', code, { shouldValidate: true });
  };

  const handleCodeChange = (code: string) => {
    setVerificationCode(code);
    setValue('otp', code, { shouldValidate: true });
  };

  const handleVerifyOTP = handleSubmit((formData: verifyOtpInput) => {
    verifyOtpMutation.mutate(formData);
  });

  const handleResendOTP = () => { 
    resendOtpMutation.mutate({ email: email });
  };

  return (
    <Authlayout image={Capandcaculator}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Verify OTP
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          We sent a code to{' '}
          <span className="text-blue-600 font-medium">
            {email || 'your email'}
          </span>
        </p>

   
        <div className="mb-6">
          <OTPInput
            ref={otpInputRef}
            length={6}
            onComplete={handleCodeComplete}
            onChange={handleCodeChange}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <form onSubmit={handleVerifyOTP}>
          <input type="hidden" value={email || ''} />
          
          <Button
            type="submit"
            loading={verifyOtpMutation.isPending}
            disabled={verificationCode.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-6"
          >
            Verify Code
          </Button>
        </form>

        <p className="text-center text-gray-600 mb-6">
          Didn't receive any email?{' '}
          <button
            type="button" 
            onClick={handleResendOTP}
            disabled={resendOtpMutation.isPending || !email}
            className="text-blue-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendOtpMutation.isPending ? (
              <span className="inline-flex items-center gap-1.5">
                <Spinner className="h-3.5 w-3.5" />
                Resending...
              </span>
            ) : (
              'Resend'
            )}
          </button>
        </p>

        <div className="text-center">
          <Link 
            href={URLS.AUTH.LOGIN}
            className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to log in
          </Link>
        </div>
      </div>
    </Authlayout>
  );
};

export default VerifyOtp;