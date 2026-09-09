import { getAccessToken } from "@/services/token";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "http://192.168.1.10:8000";

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
    console.warn(
      "🔴 Socket connection error:",
      error.message
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "🔴 Socket disconnected:",
      reason
    );
  });

  socket.onAny((event, ...args) => {
    console.log(
      "📨 SOCKET EVENT:",
      event,
      args
    );
  });

  return socket;
}

/**
 * Listen for patient vitals
 */
export function onPatientVitals(
  callback: (payload: any) => void
) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return () => {};
  }

  currentSocket.on(
    "patientVitals",
    callback
  );

  return () => {
    currentSocket.off(
      "patientVitals",
      callback
    );
  };
}

/**
 * Listen for patient alerts / commands
 */
export function onPatientAlert(
  callback: (payload: any) => void
) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return () => {};
  }

  currentSocket.on(
    "patientAlert",
    callback
  );

  return () => {
    currentSocket.off(
      "patientAlert",
      callback
    );
  };
}

/**
 * Patient -> backend
 *
 * Use only when the logged-in user is a PATIENT.
 */
export function emitPatientVitals(
  payload: Record<string, any>
) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return;
  }

  currentSocket.emit(
    "patient:vitals",
    payload
  );
}

/**
 * Patient -> backend
 *
 * Use only when the logged-in user is a PATIENT.
 */
export function emitPatientAlert(
  alertType: string
) {
  const currentSocket = initSocket();

  if (!currentSocket) {
    return;
  }

  currentSocket.emit(
    "patient:alert",
    {
      alertType,
      timestamp: new Date().toISOString(),
    }
  );
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