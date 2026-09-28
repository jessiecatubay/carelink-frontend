import { getNotificationSettings } from "@/hooks/lib/notification-settings";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let isSirenPlaying = false;
let webAudioContext: any = null;
let webOscillator: any = null;
let webGain: any = null;
let sirenInterval: any = null;

/**
 * Starts playing the emergency alarm siren sound / notification chime if alertSoundEnabled is TRUE.
 * 100% Expo Go and Web safe without unbundled native module crashes.
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

    // 1. Web Platform: Dual-tone oscillating emergency siren using Web Audio API
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          webAudioContext = new AudioContextClass();
          webOscillator = webAudioContext.createOscillator();
          webGain = webAudioContext.createGain();

          webOscillator.type = "sawtooth";
          webOscillator.frequency.setValueAtTime(800, webAudioContext.currentTime);

          let toggle = false;
          sirenInterval = setInterval(() => {
            if (!webOscillator || !webAudioContext) return;
            toggle = !toggle;
            const targetFreq = toggle ? 1000 : 700;
            webOscillator.frequency.setTargetAtTime(
              targetFreq,
              webAudioContext.currentTime,
              0.1,
            );
          }, 350);

          webGain.gain.setValueAtTime(0.4, webAudioContext.currentTime);
          webOscillator.connect(webGain);
          webGain.connect(webAudioContext.destination);
          webOscillator.start();
          return;
        }
      } catch (e) {
        console.warn("Web audio siren error:", e);
      }
    }

    // 2. Mobile (Expo Go / Android / iOS): Play emergency chime via local notification channel
    if (Platform.OS !== "web") {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🚨 EMERGENCY ALERT BROADCAST",
            body: "Critical emergency SOS alert triggered!",
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.MAX,
            vibrate: [0, 500, 200, 500, 200, 1000],
          },
          trigger: null, // deliver immediately
        });
      } catch (notifErr) {
        console.warn("Notification sound trigger note:", notifErr);
      }
    }
  } catch (error) {
    console.error("Failed to play emergency siren:", error);
  }
}

/**
 * Stops the emergency siren sound.
 */
export async function stopEmergencySiren(): Promise<void> {
  isSirenPlaying = false;

  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }

  if (webOscillator) {
    try {
      webOscillator.stop();
      webOscillator.disconnect();
    } catch {}
    webOscillator = null;
  }

  if (webAudioContext) {
    try {
      webAudioContext.close();
    } catch {}
    webAudioContext = null;
  }
}
