import { getNotificationSettings } from "@/hooks/lib/notification-settings";
import * as Notifications from "expo-notifications";
import { NativeModules, Platform, Vibration } from "react-native";

const { EmergencySoundModule } = NativeModules;

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
 * Works seamlessly in native Android Development/Release APKs, Expo Go, and Web.
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

    let nativeSoundPlayed = false;

    // 2. Native Android MediaPlayer playback (Direct hardware audio through USAGE_ALARM)
    if (Platform.OS === "android" && EmergencySoundModule?.playEmergencySound) {
      try {
        await EmergencySoundModule.playEmergencySound();
        nativeSoundPlayed = true;
        console.log("🔊 alert_sound.wav playing via Native Android MediaPlayer (EmergencySoundModule).");
      } catch (nativeErr) {
        console.warn("EmergencySoundModule.playEmergencySound error:", nativeErr);
      }
    }

    // 3. Web Audio if running on Web browser
    if (!nativeSoundPlayed && Platform.OS === "web" && typeof window !== "undefined") {
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

    // 4. Android notification chime fallback / companion
    if (Platform.OS !== "web") {
      await triggerEmergencyChime();

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

  // 1. Stop Native Android MediaPlayer
  if (Platform.OS === "android" && EmergencySoundModule?.stopEmergencySound) {
    try {
      await EmergencySoundModule.stopEmergencySound();
    } catch (nativeStopErr) {
      console.warn("EmergencySoundModule.stopEmergencySound error:", nativeStopErr);
    }
  }

  // 2. Cancel vibration
  try {
    if (Platform.OS !== "web") {
      Vibration.cancel();
    }
  } catch {}

  // 3. Clear siren interval
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }

  // 4. Stop web audio handle
  if (activeAudioHandle) {
    try {
      await activeAudioHandle.stop();
    } catch (e) {
      console.warn("Error stopping activeAudioHandle:", e);
    }
    activeAudioHandle = null;
  }
}




