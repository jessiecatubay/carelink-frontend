import axiosInstance from "@/hooks/lib/axios";

interface ConnectedNonpatientData {
  nonPatientId: string
}

export const patientCommand = (
  deviceId: string,
  command: string,
  patientId: string,
  connectedNonpatients: ConnectedNonpatientData[],
) => {
  const formData = new FormData();

  formData.append("deviceId", deviceId);
  formData.append("command", command);
  formData.append("patientId", patientId);
  formData.append(
  "connectedNonpatients",
  JSON.stringify(connectedNonpatients)
);

  return axiosInstance.post("/api/device/v1/command", formData);
};
