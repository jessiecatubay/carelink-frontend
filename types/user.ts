export interface AuthUser {
  id?: string;
  email: string;
  role?: "PATIENT" | "NON_PATIENT" | "USER";
  onBoarded?: boolean;
  firstName?: string;
  lastName?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  googleId?: string | null;
  hasPassword?: boolean;
  nonPatientProfile?: NonPatientProfile | null;
  patientProfile?: PatientProfile | null;
}

export interface UserOnBoardingData {
  userId?: string;
  email?: string;
  role?: "PATIENT" | "NON-PATIENT" | "NON_PATIENT";
  age?: number;
  gender?: string;
  medicalConditions?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContact?: string;
  relationship?: string;
  onBoarded?: boolean;
}

export interface Vital {
  id: string;
  deviceId: string;
  temperature: number;
  heartRate: number;
  sensorContact: boolean;
  batteryLevel: number | null;
  recordedAt: string;
}

export interface User {
  id: string;
  email: string | null;
  password: string | null;
  createdAt: Date;
  firstName: string;
  lastName: string;
  role: "PATIENT" | "NON-PATIENT" | "USER";
  onBoarded: boolean;
  updatedAt: Date;
  emergencyContact?: string | null;
  emergencyContactName?: string | null;
  nonPatientProfile: NonPatientProfile | null;
  patientProfile: PatientProfile | null;
  patientConnections: PatientNonPatient[];
  nonPatientConnections: PatientNonPatient[];
}

export interface NonPatientProfile {
  id: string;
  userId: string;
  emergencyContact: string | number | null;
  emergencyContactName?: string | null;
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
  currentPatient?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  nonPatient?: User | AuthUser | null;
  patient?: User | AuthUser | null;
}

export interface QrCodeData {
  connectionCode: string;
}
