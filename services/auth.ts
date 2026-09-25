import axiosInstance from "@/hooks/lib/axios";
import { UserOnBoardingData } from "@/types/user";

export const login = async (email: string, password: string) => {
  return axiosInstance.post("/api/user/v1/login", { email, password });
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  return axiosInstance.post("/api/user/v1/signup", {
    firstName,
    lastName,
    email,
    password,
  });
};

export const resendVerification = async () => {
  return axiosInstance.post("/api/user/v1/resend-verification");
};

export const checkVerification = async () => {
  return axiosInstance.get("/api/user/v1/check-verification");
};

export const userOnboarding = async (data: UserOnBoardingData) => {
  return axiosInstance.post("/api/user/v1/user-onboarding", data);
};

export const getMe = async () => {
  return axiosInstance.get("/api/user/v1/me");
};

export const forgotPassword = async (email: string) => {
  return axiosInstance.post("/api/user/v1/forgot-password", { email });
};

export async function resetPassword(resetToken: string, newPassword: string) {
  return axiosInstance.post("/api/user/v1/reset-password", {
    resetToken,
    newPassword,
  });
}

export async function verifyResetCode(email: string, resetCode: string) {
  return axiosInstance.post("/api/user/v1/verify-reset-code", {
    email,
    resetCode,
  });
}

export const changePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
) => {
  return axiosInstance.post("/api/user/v1/change-password", {
    id,
    currentPassword,
    newPassword,
  });
};

export async function verifyEmail(email: string, verificationCode: string) {
  return axiosInstance.post("/api/user/v1/verify-email", {
    email,
    verificationCode,
  });
}

export async function resendEmailVerification(email: string) {
  return axiosInstance.post("/api/user/v1/resend-email-verification", {
    email,
  });
}
