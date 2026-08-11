import axiosInstance from "@/lib/axios";
import { AuthUser } from "@/types/user";

export const login = async (
  email: string,
  password: string
) => {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("password", password);

  return axiosInstance.post("/api/user/v1/login", formData);
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const formData = new FormData();

  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("password", password);

  return axiosInstance.post("/api/user/v1/signup", formData);
};

export const resendVerification = async () => {
  return axiosInstance.post("/api/user/v1/resend-verification");
};

export const checkVerification = async () => {
  return axiosInstance.get("/api/user/v1/check-verification");
};

export const userOnboarding = async (data: AuthUser) => {
  return axiosInstance.post("/api/user/v1/user-onboarding", data);
}