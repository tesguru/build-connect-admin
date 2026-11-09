"use client";
import React, { useRef, useState } from "react";
import Authlayout from "../Authlayout";
import { EngineersWithBuidlingPlan } from "@/libs/constants/image";
import { OTPInput, OTPInputRef } from "@/components/ui/Forms/InputOtp";
import InputField from "@/components/ui/Forms/InputField";
import { PasswordInput } from "@/components/ui/Forms/PasswordInput";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/libs/hooks/useAuth";
import {
  setupCodeSchema,
  resetPasswordSchema,
} from "@/libs/schema/authschema";
import type {
  SetupCodeInput,
  resetPasswordInput,
} from "@/libs/schema/authschema";
import { URLS } from "@/libs/constants/pageurl";
import { ShieldCheck, CheckCircle2, ArrowLeft, Mail } from "lucide-react";

const StepBadge = ({
  index,
  label,
  state,
}: {
  index: number;
  label: string;
  state: "active" | "done" | "todo";
}) => (
  <div className="flex items-center gap-2">
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
        state === "done"
          ? "bg-green-600 text-white"
          : state === "active"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      {state === "done" ? <CheckCircle2 className="h-4 w-4" /> : index}
    </span>
    <span
      className={`text-sm font-medium ${
        state === "todo" ? "text-gray-400" : "text-gray-700"
      }`}
    >
      {label}
    </span>
  </div>
);

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const otpInputRef = useRef<OTPInputRef>(null);

  const [step, setStep] = useState<"code" | "password">("code");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verifiedCode, setVerifiedCode] = useState("");

  const { verifySetupCodeMutation, setupPasswordMutation } = useAuth();

  const codeForm = useForm<SetupCodeInput>({
    resolver: zodResolver(setupCodeSchema),
    defaultValues: { email: emailParam, otp: "" },
  });
  const otpValue = codeForm.watch("otp");

  const passwordForm = useForm<resetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  const handleCodeChange = (code: string) => {
    codeForm.setValue("otp", code, { shouldValidate: true });
  };

  const handleVerify = codeForm.handleSubmit((formData: SetupCodeInput) => {
    verifySetupCodeMutation.mutate(formData, {
      onSuccess: (res: any) => {
        if (res?.data?.statusCode === 200) {
          setVerifiedEmail(formData.email);
          setVerifiedCode(formData.otp);
          setStep("password");
        }
      },
    });
  });

  const handleSetup = passwordForm.handleSubmit((formData: resetPasswordInput) => {
    setupPasswordMutation.mutate({
      email: verifiedEmail,
      otp: verifiedCode,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    });
  });

  const backToCode = () => {
    passwordForm.reset();
    setStep("code");
  };

  return (
    <Authlayout image={EngineersWithBuidlingPlan}>
      <div className="mb-8 flex items-center justify-center gap-3">
        <StepBadge
          index={1}
          label="Verify code"
          state={step === "code" ? "active" : "done"}
        />
        <span className="h-px w-6 bg-gray-200" />
        <StepBadge
          index={2}
          label="Set password"
          state={step === "password" ? "active" : "todo"}
        />
      </div>

      {step === "code" ? (
        <>
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
              Set Up Your Account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base text-center">
              Enter the 6-digit setup code we emailed you. It&apos;s valid for 48 hours.
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <InputField
                label="Email Address"
                id="email"
                type="email"
                placeholder="Enter Email Address"
                error={codeForm.formState.errors.email?.message}
                {...codeForm.register("email")}
              />
            </div>

            <div className="mb-6">
              <OTPInput
                ref={otpInputRef}
                length={6}
                onComplete={handleCodeChange}
                onChange={handleCodeChange}
              />
              {codeForm.formState.errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {codeForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={verifySetupCodeMutation.isPending}
              disabled={otpValue?.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-6"
            >
              Verify Code
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <p className="text-sm text-green-800">
              Code verified for{" "}
              <span className="font-semibold break-all">{verifiedEmail}</span>. Choose a
              password to finish setting up your account.
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
              Create Your Password
            </h1>
            <p className="text-gray-600 text-sm sm:text-base text-center">
              Use at least 8 characters. You&apos;ll be signed in right after.
            </p>
          </div>

          <form onSubmit={handleSetup}>
            <div className="mb-4">
              <PasswordInput
                label="New Password"
                id="newPassword"
                placeholder="Enter new password"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register("newPassword")}
              />
            </div>

            <div className="mb-6">
              <PasswordInput
                label="Confirm New Password"
                id="confirmNewPassword"
                placeholder="Confirm new password"
                error={passwordForm.formState.errors.confirmNewPassword?.message}
                {...passwordForm.register("confirmNewPassword")}
              />
            </div>

            <Button
              type="submit"
              loading={setupPasswordMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-4"
            >
              Set Password &amp; Sign In
            </Button>

            <button
              type="button"
              onClick={backToCode}
              disabled={setupPasswordMutation.isPending}
              className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-900 transition-colors text-sm disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Use a different code
            </button>
          </form>
        </>
      )}

      <div className="mt-8 rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">
              Code expired or email never arrived?
            </p>
            <p>
              Ask a super admin to resend your invite, or{" "}
              <Link
                href={URLS.AUTH.FORGOT_PASSWORD}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                reset your password
              </Link>{" "}
              to get a new code.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href={URLS.AUTH.LOGIN}
          className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to log in
        </Link>
      </div>
    </Authlayout>
  );
};

export default ResetPassword;