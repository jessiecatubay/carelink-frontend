import axiosInstance from "@/hooks/lib/axios";
import { AuthUser, UserOnBoardingData } from "@/types/user";

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

export const resetPassword = async (password: string, token?: string) => {
  return axiosInstance.post("/api/user/v1/reset-password", { password, token });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  return axiosInstance.post("/api/user/v1/change-password", {
    currentPassword,
    newPassword,
  });
};
