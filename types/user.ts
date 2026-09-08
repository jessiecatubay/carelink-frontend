export interface AuthUser {
  id?: string;
  email?: string;
  role?: "PATIENT" | "NON_PATIENT" | "USER";
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
  role: "PATIENT" | "NON_PATIENT" | "USER";
  onBoarded: boolean;
  updatedAt: Date;
  nonPatientProfile: NonPatientProfile | null;
  patientProfile: PatientProfile | null;
  patientConnections: PatientNonPatient[];
  nonPatientConnections: PatientNonPatient[];
}

export interface NonPatientProfile {
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

export interface PatientNonPatient {
  id: string;
  patientId: string;
  nonPatientId: string;
  status: "CONNECTED" | "DISCONNECTED";
  createdAt: Date;
  updatedAt: Date;
}

export interface QrCodeData {
  connectionCode: string;
}