import { getAccessToken } from "@/services/token";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getBackendUrl = () =>
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.10:8000";

export function initSocket() {
  if (socket) return socket;

  const token = getAccessToken();
  const backend = getBackendUrl();

  socket = io(backend, {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected", socket?.id);
  });

  socket.on("connect_error", (err: Error) => {
    console.warn("Socket connect_error", err);
  });

  socket.on("disconnect", (reason: string) => {
    console.log("Socket disconnected", reason);
  });

  return socket;
}

export function emitPatientVitals(payload: Record<string, any>) {
  if (!socket) initSocket();
  if (!socket) return;

  // Emit a clear event name for server to handle. Backend can map to router.post if it bridges sockets.
  socket.emit("patient:vitals", payload);
}

export function emitPatientAlert(alertType: string) {
  if (!socket) initSocket();
  if (!socket) return;

  socket.emit("patient:alert", {
    alertType,
    timestamp: new Date().toISOString(),
  });
}

export function onPatientVitals(callback: (payload: any) => void) {
  if (!socket) initSocket();
  if (!socket) return () => {};

  socket.on("patientVitals", callback);

  return () => {
    socket?.off("patientVitals", callback);
  };
}

export function onPatientAlert(callback: (payload: any) => void) {
  if (!socket) initSocket();
  if (!socket) return () => {};

  socket.on("patientAlert", callback);

  return () => {
    socket?.off("patientAlert", callback);
  };
}

export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
