import axiosInstance from "@/hooks/lib/axios";

export const patientCommand = (
  deviceId: string,
  command: string,
  patientId: string,
) => {
  const formData = new FormData();

  formData.append("deviceId", deviceId);
  formData.append("command", command);
  formData.append("patientId", patientId);

  return axiosInstance.post("/api/device/v1/command", formData);
};
