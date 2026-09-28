import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform, Vibration } from "react-native";

const HAPTIC_STORAGE_KEY = "@carelink_haptic_feedback_enabled";

// Synchronous in-memory cache for direct helper invocations
let globalHapticEnabled = true;

export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

interface HapticsContextType {
  hapticFeedbackEnabled: boolean;
  setHapticFeedbackEnabled: (enabled: boolean) => Promise<void>;
  triggerHaptic: (type?: HapticType) => void;
  triggerVibration: (pattern?: number | number[]) => void;
}

const HapticsContext = createContext<HapticsContextType>({
  hapticFeedbackEnabled: true,
  setHapticFeedbackEnabled: async () => {},
  triggerHaptic: () => {},
  triggerVibration: () => {},
});

/**
 * Directly triggers haptic feedback if enabled by the user in settings.
 * Safe to call from any component, hook, or event handler.
 */
export function triggerAppHaptic(type: HapticType = "light") {
  if (!globalHapticEnabled) return;

  try {
    switch (type) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "error":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // Fallback vibration if expo-haptics is unavailable
    if (Platform.OS === "android") {
      Vibration.vibrate(20);
    }
  }
}

/**
 * Triggers device vibration pattern if haptic feedback is enabled.
 */
export function triggerAppVibration(pattern: number | number[] = 40) {
  if (!globalHapticEnabled) return;
  try {
    Vibration.vibrate(pattern);
  } catch {}
}

export function HapticsProvider({ children }: { children: React.ReactNode }) {
  const [hapticFeedbackEnabled, setHapticState] = useState<boolean>(true);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(HAPTIC_STORAGE_KEY);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          setHapticState(parsed);
          globalHapticEnabled = parsed;
        } else {
          globalHapticEnabled = true;
        }
      } catch (e) {
        console.error("Failed to load haptic settings:", e);
      }
    };

    loadPreference();
  }, []);

  const setHapticFeedbackEnabled = async (enabled: boolean) => {
    setHapticState(enabled);
    globalHapticEnabled = enabled;
    try {
      await AsyncStorage.setItem(HAPTIC_STORAGE_KEY, JSON.stringify(enabled));
      // Give a brief confirmation vibration when turned ON
      if (enabled) {
        triggerAppHaptic("medium");
      }
    } catch (e) {
      console.error("Failed to save haptic settings:", e);
    }
  };

  const triggerHaptic = (type: HapticType = "light") => {
    if (!hapticFeedbackEnabled) return;
    triggerAppHaptic(type);
  };

  const triggerVibration = (pattern: number | number[] = 40) => {
    if (!hapticFeedbackEnabled) return;
    triggerAppVibration(pattern);
  };

  return (
    <HapticsContext.Provider
      value={{
        hapticFeedbackEnabled,
        setHapticFeedbackEnabled,
        triggerHaptic,
        triggerVibration,
      }}
    >
      {children}
    </HapticsContext.Provider>
  );
}

export function useHaptics() {
  return useContext(HapticsContext);
}
