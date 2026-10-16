import { getNotificationSettings } from "@/hooks/lib/notification-settings";
import * as Notifications from "expo-notifications";
import { Platform, Vibration } from "react-native";

let isSirenPlaying = false;
let chimeIntervalId: ReturnType<typeof setInterval> | null = null;
let webAudio: any = null;

// alert_sound.wav has an exact duration of ~5.59 seconds
const WAV_LOOP_INTERVAL_MS = 5500;

/**
 * Triggers the emergency siren notification chime fallback.
 * Uses sticky + autoDismiss:false so the notification banner CANNOT be dismissed by swiping away on Android,
 * and refreshes the sound every loop cycle.
 */
async function triggerEmergencyChime(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    // Dismiss previous instance so Android treats this as a fresh alert and replays the sound
    await Notifications.dismissNotificationAsync("carelink-emergency-active").catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: "carelink-emergency-active",
      content: {
        title: "🚨 CARELINK EMERGENCY ALERT",
        body: "Emergency siren active — Connected patient needs immediate assistance! Tap to respond.",
        sound: "alert_sound.wav",
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 600, 200, 600, 200, 600, 400, 800],
        sticky: true,
        autoDismiss: false,
        data: { type: "EMERGENCY", command: "EMERGENCY" },
      },
      trigger: Platform.OS === "android" ? { channelId: "carelink-emergency-v3" } : null,
    });
  } catch (err) {
    console.warn("triggerEmergencyChime error:", err);
  }
}

function playWebAudio() {
  if (Platform.OS !== "web") return;
  try {
    if (typeof window !== "undefined" && typeof window.Audio !== "undefined") {
      if (!webAudio) {
        try {
          const soundAsset = require("@/assets/sounds/alert_sound.wav");
          const src = typeof soundAsset === "string" ? soundAsset : soundAsset?.default || soundAsset?.uri;
          if (src) {
            webAudio = new window.Audio(src);
            webAudio.loop = true;
          }
        } catch {
          // Fallback or asset require unsupported
        }
      }
      if (webAudio) {
        webAudio.play().catch(() => {});
      }
    }
  } catch (err) {
    console.warn("Web audio playback error:", err);
  }
}

function stopWebAudio() {
  if (Platform.OS !== "web" || !webAudio) return;
  try {
    webAudio.pause();
    webAudio.currentTime = 0;
  } catch {}
}

/**
 * Plays the emergency siren sound using alert_sound.wav.
 * Loops vibration and triggers the high-priority emergency notification channel with custom sound.
 * Won't stop until stopEmergencySiren() is called upon caregiver acknowledgment.
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

    // 2. Web browser audio playback if on Web
    if (Platform.OS === "web") {
      playWebAudio();
    }

    // 3. Native emergency notification chime with custom sound (res/raw/alert_sound.wav)
    if (Platform.OS !== "web") {
      await triggerEmergencyChime();

      // Clear any previous interval just in case
      if (chimeIntervalId) {
        clearInterval(chimeIntervalId);
        chimeIntervalId = null;
      }

      // Re-trigger chime every 5.5 seconds (duration of alert_sound.wav) so it loops continuously
      chimeIntervalId = setInterval(() => {
        if (!isSirenPlaying) {
          if (chimeIntervalId) {
            clearInterval(chimeIntervalId);
            chimeIntervalId = null;
          }
          return;
        }
        triggerEmergencyChime();
      }, WAV_LOOP_INTERVAL_MS);
    }
  } catch (error) {
    console.error("Failed to play emergency siren:", error);
  }
}

/**
 * Stops the emergency siren sound, cancels vibration, and dismisses the emergency banner.
 * Called when the caregiver acknowledges the emergency.
 */
export async function stopEmergencySiren(): Promise<void> {
  isSirenPlaying = false;

  if (chimeIntervalId) {
    clearInterval(chimeIntervalId);
    chimeIntervalId = null;
  }

  // 1. Stop web audio if playing
  stopWebAudio();

  // 2. Cancel vibration
  try {
    if (Platform.OS !== "web") {
      Vibration.cancel();
    }
  } catch {}

  // 3. Dismiss sticky emergency notification banner
  try {
    if (Platform.OS !== "web") {
      await Notifications.dismissNotificationAsync("carelink-emergency-active");
    }
  } catch {}
}
