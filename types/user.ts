export interface AuthUser {
  id?: string;
  email?: string;
  role?: "PATIENT" | "CAREGIVER" | "USER";
  onBoarded?: boolean;
  firstName?: string;
  lastName?: string;
}
