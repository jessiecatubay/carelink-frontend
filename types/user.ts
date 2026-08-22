export interface AuthUser {
  id?: string;
  email?: string;
  role?: "PATIENT" | "CAREGIVER" | "USER";
  onBoarded?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface Vital {
  id: string;
  deviceId: string;
  temperature: number;
  heartRate: number;
  recordedAt: string;
}