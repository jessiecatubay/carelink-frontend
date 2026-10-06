import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const nameStepSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
});

export const emailStepSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

export const codeStepSchema = z.object({
  code: z.string().trim().length(6, "Please enter the 6-digit verification code."),
});

export const passwordStepSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required."),
    lastName: z.string().trim().min(2, "Last name is required."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type NameStepValues = z.infer<typeof nameStepSchema>;
export type EmailStepValues = z.infer<typeof emailStepSchema>;
export type CodeStepValues = z.infer<typeof codeStepSchema>;
export type PasswordStepValues = z.infer<typeof passwordStepSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Must contain at least one number."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
