import { z } from "zod";

export const commandSchema = z.enum([
  "FOOD",
  "WATER",
  "ASSISTANCE",
  "EMERGENCY",
  "SATISFIED",
]);

export const remoteCommandSchema = z.object({
  id: z.string().min(1),
  command: commandSchema,
  recordedAt: z.string().datetime({ offset: true }),
  status: z.enum(["Pending", "Satisfied"]),
});

export const patientVitalsSchema = z
  .object({
    deviceId: z.string().min(1).optional(),
    patientId: z.string().uuid().optional(),
    temperature: z.number().finite().optional(),
    heartRate: z.number().finite().optional(),
    sensorContact: z.boolean().optional(),
    receivedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();

export const patientAlertSchema = z
  .object({
    id: z.string().min(1).optional(),
    command: commandSchema.optional(),
    alertType: commandSchema.optional(),
    status: z.enum(["Pending", "Satisfied"]).optional(),
    timestamp: z.string().datetime({ offset: true }).optional(),
    recordedAt: z.string().datetime({ offset: true }).optional(),
    patientId: z.string().uuid().optional(),
  })
  .passthrough()
  .refine((payload) => payload.command || payload.alertType, {
    message: "command or alertType is required",
  });

export const qrCodeSchema = z.object({
  connectionCode: z.string().trim().min(1),
});

export const patientOnboardingSchema = z.object({
  age: z
    .string()
    .trim()
    .min(1, "Age is required.")
    .regex(/^\d+$/, "Age must be a whole number.")
    .transform(Number)
    .refine((value) => value >= 1 && value <= 120, {
      message: "Age must be between 1 and 120.",
    }),
  gender: z.string().trim().min(1, "Gender is required."),
  medicalConditions: z
    .string()
    .trim()
    .min(1, "Medical conditions are required."),
  notes: z.string().trim().max(500, "Notes must be 500 characters or fewer."),
});

export const nonPatientOnboardingSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Emergency phone number is required.")
    .regex(/^[+\d\s().-]+$/, "Enter a valid phone number.")
    .refine((value) => value.replace(/\D/g, "").length >= 7, {
      message: "Phone number must contain at least 7 digits.",
    })
    .refine((value) => value.replace(/\D/g, "").length <= 15, {
      message: "Phone number must contain 15 digits or fewer.",
    }),
  relationship: z
    .string()
    .trim()
    .min(1, "Relationship is required.")
    .max(50, "Relationship must be 50 characters or fewer."),
});

export const vitalResponseSchema = z.object({
  id: z.string().min(1),
  deviceId: z.string().min(1),
  temperature: z.number().finite(),
  heartRate: z.number().finite(),
  sensorContact: z.boolean(),
  recordedAt: z.string().datetime({ offset: true }),
});

export type RemoteCommand = z.infer<typeof remoteCommandSchema>;
export type PatientVitals = z.infer<typeof patientVitalsSchema>;
export type PatientAlert = z.infer<typeof patientAlertSchema>;
export type PatientOnboardingInput = z.input<typeof patientOnboardingSchema>;
export type PatientOnboardingData = z.output<typeof patientOnboardingSchema>;
export type NonPatientOnboardingInput = z.infer<
  typeof nonPatientOnboardingSchema
>;
