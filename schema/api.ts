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
