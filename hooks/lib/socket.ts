import {
  patientAlertSchema,
  patientVitalsSchema,
  type PatientAlert,
  type PatientVitals,
} from "@/schema/api";
import { getAccessToken } from "@/services/token";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.10:8000";

/**
 * Initialize Socket.IO connection
 */
export function initSocket() {
  if (socket) {
    return socket;
  }

  const token = getAccessToken();
  const backend = getBackendUrl();

  if (!token) {
    console.warn("⚠️ No access token available for Socket.IO");
    return null;
  }

  console.log("🔌 Connecting Socket.IO to:", backend);

  socket = io(backend, {
    transports: ["websocket"],

    auth: {
      token,
    },

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket?.id);
  });

  socket.on("connect_error", (error) => {
    console.warn("🔴 Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  socket.onAny((event, ...args) => {
    console.log("📨 SOCKET EVENT:", event, args);
  });

  return socket;
}

export function startPatientPresence() {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return () => {};
  }

  const sendHeartbeat = () => {
    if (!currentSocket.connected) {
      return;
    }

    currentSocket.emit("patient:heartbeat");
  };

  sendHeartbeat();

  const interval = setInterval(sendHeartbeat, 10000);

  return () => {
    clearInterval(interval);
  };
}

/**
 * Listen for patient vitals
 */
export function onPatientVitals(callback: (payload: PatientVitals) => void) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return () => {};
  }

  const handleVitals = (payload: unknown) => {
    const parsed = patientVitalsSchema.safeParse(payload);
    if (parsed.success) callback(parsed.data);
  };

  currentSocket.on("patientVitals", handleVitals);

  return () => {
    currentSocket.off("patientVitals", handleVitals);
  };
}

/**
 * Listen for patient alerts / commands
 */
export function onPatientAlert(callback: (payload: PatientAlert) => void) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return () => {};
  }

  const handleAlert = (payload: unknown) => {
    const parsed = patientAlertSchema.safeParse(payload);
    if (parsed.success) callback(parsed.data);
  };

  currentSocket.on("patientAlert", handleAlert);

  return () => {
    currentSocket.off("patientAlert", handleAlert);
  };
}

export function onPatientConnectionStatus(
  callback: (payload: {
    patientId: string;
    status: "CONNECTED" | "DISCONNECTED";
    timestamp: string;
  }) => void,
) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return () => {};
  }

  const handleStatus = (payload: unknown) => {
    if (!payload || typeof payload !== "object") {
      return;
    }

    const data = payload as Record<string, unknown>;

    if (
      typeof data.patientId !== "string" ||
      (data.status !== "CONNECTED" && data.status !== "DISCONNECTED") ||
      typeof data.timestamp !== "string"
    ) {
      return;
    }

    callback({
      patientId: data.patientId,
      status: data.status,
      timestamp: data.timestamp,
    });
  };

  currentSocket.on("patientConnectionStatus", handleStatus);

  return () => {
    currentSocket.off("patientConnectionStatus", handleStatus);
  };
}

/**
 * Patient -> backend
 *
 * Use only when the logged-in user is a PATIENT.
 */
export function emitPatientVitals(payload: Record<string, any>) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return;
  }

  currentSocket.emit("patient:vitals", payload);
}

/**
 * Patient -> backend
 *
 * Use only when the logged-in user is a PATIENT.
 */
export function emitPatientAlert(alertType: string) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return;
  }

  currentSocket.emit("patient:alert", {
    alertType,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get current socket
 */
export function getSocket() {
  return socket;
}

/**
 * Close socket
 */
export function closeSocket() {
  if (!socket) {
    return;
  }

  console.log("🔌 Closing Socket.IO connection");

  socket.removeAllListeners();
  socket.disconnect();

  socket = null;
}
