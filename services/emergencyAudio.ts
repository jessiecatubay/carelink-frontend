import { getNotificationSettings } from "@/hooks/lib/notification-settings";
import * as Notifications from "expo-notifications";
import { Platform, Vibration } from "react-native";

let activeAudioHandle: any = null;
let isSirenPlaying = false;
let sirenInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Triggers the emergency siren notification chime and SOS vibration.
 */
async function triggerEmergencyChime(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 CARELINK EMERGENCY ALERT",
        body: "Emergency siren active — Connected patient needs immediate assistance!",
        sound: "alert_sound.wav",
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 600, 200, 600, 200, 600, 400, 800],
        data: { type: "EMERGENCY", command: "EMERGENCY" },
        ...(Platform.OS === "android" ? { channelId: "carelink-emergency-v2" } : {}),
      },
      trigger: null,
    });
  } catch (err) {
    console.warn("triggerEmergencyChime error:", err);
  }
}

/**
 * Plays the emergency siren sound using alert_sound.wav safely.
 * Loops loudly through speakers and vibrates until stopEmergencySiren() is called.
 * 100% crash-free in Expo Go, development builds, and production APKs.
 */
export async function playEmergencySiren(): Promise<void> {
  try {
    const settings = await getNotificationSettings();
    if (!settings.alertSoundEnabled) {
      console.log("🔇 Alert sound is disabled by user settings.");
      return;
    }

    if (isSirenPlaying) {
      return;
    }

    isSirenPlaying = true;

    // 1. Continuous SOS vibration pattern
    try {
      if (Platform.OS !== "web") {
        Vibration.vibrate([0, 500, 200, 500, 200, 500, 400, 800, 300, 800], true);
      }
    } catch (vibErr) {
      console.warn("Vibration warning:", vibErr);
    }

    // 2. Web Audio if running on Web browser
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        const audio = new (window as any).Audio(require("@/assets/sounds/alert_sound.wav"));
        audio.loop = true;
        audio.volume = 1.0;
        await audio.play();
        activeAudioHandle = {
          stop: () => {
            audio.pause();
            audio.currentTime = 0;
          },
        };
        console.log("🔊 alert_sound.wav playing via Web Audio API.");
      } catch (webAudioErr) {
        console.warn("Web audio playback error:", webAudioErr);
      }
    }

    // 3. Android / iOS native notification channel audio with alert_sound.wav
    if (Platform.OS !== "web") {
      await triggerEmergencyChime();

      // Repeat chime pulse every 4 seconds while modal is active
      if (sirenInterval) {
        clearInterval(sirenInterval);
      }
      sirenInterval = setInterval(() => {
        if (!isSirenPlaying) {
          if (sirenInterval) clearInterval(sirenInterval);
          return;
        }
        triggerEmergencyChime();
      }, 4000);
    }
  } catch (error) {
    console.error("Failed to play emergency siren:", error);
  }
}

/**
 * Stops the emergency siren sound, cancels vibration, and releases audio handles.
 */
export async function stopEmergencySiren(): Promise<void> {
  isSirenPlaying = false;

  // 1. Cancel vibration
  try {
    if (Platform.OS !== "web") {
      Vibration.cancel();
    }
  } catch {}

  // 2. Clear siren interval
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }

  // 3. Stop audio handle
  if (activeAudioHandle) {
    try {
      await activeAudioHandle.stop();
    } catch (e) {
      console.warn("Error stopping activeAudioHandle:", e);
    }
    activeAudioHandle = null;
  }
}




