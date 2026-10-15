import { AppState, AppStateStatus } from "react-native";
import { getSocket } from "@/hooks/lib/socket";

type NetworkStatusListener = (isOnline: boolean) => void;

let isOnline = true;
const listeners = new Set<NetworkStatusListener>();
let pollTimer: ReturnType<typeof setTimeout> | null = null;
let isChecking = false;

const PRIMARY_PROBE_URL = "https://clients3.google.com/generate_204";
const SECONDARY_PROBE_URL = "https://www.google.com/generate_204";
const TIMEOUT_MS = 3500;

/**
 * Ping a 204 endpoint to verify real internet connectivity
 */
async function pingEndpoint(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.status >= 200 && response.status < 400;
  } catch {
    clearTimeout(timeoutId);
    return false;
  }
}

/**
 * Run internet reachability check
 */
export async function checkInternetReachability(): Promise<boolean> {
  if (isChecking) {
    return isOnline;
  }
  isChecking = true;

  try {
    // 1. Try primary endpoint
    let reachable = await pingEndpoint(PRIMARY_PROBE_URL);

    // 2. If primary failed, try secondary fallback
    if (!reachable) {
      reachable = await pingEndpoint(SECONDARY_PROBE_URL);
    }

    setNetworkStatus(reachable);
    return reachable;
  } finally {
    isChecking = false;
  }
}

function setNetworkStatus(newStatus: boolean) {
  if (isOnline !== newStatus) {
    isOnline = newStatus;
    listeners.forEach((listener) => {
      try {
        listener(isOnline);
      } catch (err) {
        console.warn("Error in network status listener:", err);
      }
    });
  }

  scheduleNextCheck();
}

function scheduleNextCheck() {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }

  // When offline, check frequently (every 4s) so the user gets back online fast.
  // When online, check occasionally (every 25s) to conserve battery/data.
  const interval = isOnline ? 25000 : 4000;

  pollTimer = setTimeout(() => {
    checkInternetReachability();
  }, interval);
}

/**
 * Subscribe to network status changes
 */
export function addNetworkStatusListener(listener: NetworkStatusListener): () => void {
  listeners.add(listener);
  // Immediately notify listener of current state
  listener(isOnline);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Notify monitor of an API network error to trigger an immediate reachability check
 */
export function reportNetworkError() {
  checkInternetReachability();
}

/**
 * Initialize monitor listeners (AppState & Socket events)
 */
let isInitialized = false;

export function initNetworkMonitor() {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Initial reachability probe
  checkInternetReachability();

  // 2. Re-check on AppState change (foregrounding)
  AppState.addEventListener("change", (status: AppStateStatus) => {
    if (status === "active") {
      checkInternetReachability();
    }
  });

  // 3. Socket event bindings
  const bindSocketEvents = () => {
    const socket = getSocket();
    if (socket) {
      socket.on("connect", () => {
        setNetworkStatus(true);
      });

      socket.on("connect_error", () => {
        // Socket connection failed: test if the device lost internet altogether
        checkInternetReachability();
      });

      socket.on("disconnect", (reason: string) => {
        if (reason === "transport close" || reason === "transport error" || reason === "ping timeout") {
          checkInternetReachability();
        }
      });
    }
  };

  bindSocketEvents();

  // In case socket is initialized later, check again periodically for socket instance
  const socketCheckInterval = setInterval(() => {
    const socket = getSocket();
    if (socket) {
      bindSocketEvents();
      clearInterval(socketCheckInterval);
    }
  }, 2000);
}

export function getCurrentNetworkStatus(): boolean {
  return isOnline;
}
