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
  sensorContact: boolean;
  recordedAt: string;
}

export interface User {
  id: string;
  email: string | null;
  password: string | null;
  createdAt: Date;
  firstName: string;
  lastName: string;
  role: "PATIENT" | "CAREGIVER" | "USER";
  onBoarded: boolean;
  updatedAt: Date;
  caregiverProfile: CaregiverProfile | null;
  patientProfile: PatientProfile | null;
  patientConnections: PatientCaregiver[];
  caregiverConnections: PatientCaregiver[];
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  emergencyNumber: number | null;
  relationship: string | null;
}

export interface PatientProfile {
  id: string;
  userId: string;
  connectionCode: string;
  age: number | null;
  gender: string | null;
  notes: string | null;
  emergencyContact: string | null;
  medicalConditions: string | null;
}

export interface PatientCaregiver {
  id: string;
  patientId: string;
  caregiverId: string;
  status: "CONNECTED" | "DISCONNECTED";
  createdAt: Date;
  updatedAt: Date;
}