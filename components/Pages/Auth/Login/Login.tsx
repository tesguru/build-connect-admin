import React from "react";
import Authlayout from "../Authlayout";
import { PasswordInput } from "@/components/ui/Forms/PasswordInput";
import InputField from "@/components/ui/Forms/InputField";
import { AmanwithBuildingPlan } from "@/libs/constants/image";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { URLS } from "@/libs/constants/pageurl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/libs/hooks/useAuth";
import { loginSchema } from "@/libs/schema/authschema";
import type { LoginFormData } from "@/libs/schema/authschema"; // Add this import

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ // Add type for useForm
    resolver: zodResolver(loginSchema),
  });

  const { loginMutation } = useAuth();

  // Add the handleSubmit function
  const handleLogin = handleSubmit((data: LoginFormData) => {
    loginMutation.mutate(data);
  });

  return (
    <Authlayout image={AmanwithBuildingPlan}>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
          Welcome Back!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base text-center">
          Sign in to manage BuildConnect.
        </p>
      </div>
      
      {/* Add form wrapper */}
      <form onSubmit={handleLogin}>
        <div className="mb-6">
          <InputField
            label="Email Address"
            id="email"
            placeholder="Enter Email Address"
            error={errors.emailAddress?.message}
            {...register("email")}
          />
        </div>

        <div className="mb-6">
          <PasswordInput
            label="Password"
            id="password"
            placeholder="Enter Password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button 
          type="submit"
          loading={loginMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-6"
        >
          Login
        </Button>
      </form>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Forgot Password?{" "}
          <Link href={URLS.AUTH.FORGOT_PASSWORD} className="text-blue-600 hover:text-blue-700 font-medium">
            Recover
          </Link>
        </p>
      </div>
    </Authlayout>
  );
};

export default Login;