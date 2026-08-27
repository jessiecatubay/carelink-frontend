import axiosInstance from "@/lib/axios";

export const patientCommand = (deviceId: string, command: string) => {
  const formData = new FormData();

  formData.append("deviceId", deviceId);
  formData.append("command", command);

  return axiosInstance.post("/api/device/v1/command", formData);
};
