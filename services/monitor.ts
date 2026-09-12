import axiosInstance from "@/hooks/lib/axios";

interface ConnectedNonpatientData {
  nonPatientId: string;
}

export const patientCommand = (
  deviceId: string,
  command: string,
  patientId: string,
  connectedNonpatients: ConnectedNonpatientData[],
) => {
  return axiosInstance.post("/api/device/v1/command", {
    deviceId,
    command,
    patientId,
    connectedNonpatients,
  });
};
