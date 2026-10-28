

import { z } from 'zod';

export const createAccountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.enum(["super_admin", "admin", "user"]), // Added other possible roles for completeness
  location: z.string().min(1, "Location is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const createAdminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(4, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  role: z.enum(["super_admin", "supervisor", "operations", "support"]),
});

export type createAdminInput = z.infer<typeof createAdminSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password cannot exceed 32 characters")
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    // ),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    // ),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
      otp: z.string().min(1, "Otp is required"),   
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>



export type createAccountInput = z.infer<typeof createAccountSchema>;
export type loginInput = z.infer<typeof loginSchema>;
export type forgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type verifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;