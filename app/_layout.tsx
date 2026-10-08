import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { AuthProvider } from "@/context/AuthContext";
import { EmergencyAlertProvider } from "@/context/EmergencyAlertContext";
import { HapticsProvider } from "@/context/HapticsContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { initSocket } from "@/hooks/lib/socket";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Notifications from "expo-notifications";
import { getNotificationSettings } from "@/hooks/lib/notification-settings";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const settings = await getNotificationSettings();

    const data = (notification.request.content.data || {}) as {
      type?: string;
      command?: string;
      alertType?: string;
    };

    const command = (data?.command || "").toUpperCase();
    const alertType = (data?.alertType || "").toUpperCase();
    const type = (data?.type || "").toUpperCase();
    const title = (notification.request.content.title || "").toLowerCase();

    const isEmergency =
      type === "EMERGENCY" ||
      command === "EMERGENCY" ||
      alertType === "EMERGENCY" ||
      title.includes("emergency");

    if (isEmergency) {
      return {
        shouldShowAlert: true,
        shouldPlaySound: settings.alertSoundEnabled,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    }

    if (!settings.notificationsEnabled) {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: settings.alertSoundEnabled,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    "Italianno-Regular": require("@/assets/fonts/Italianno-Regular.ttf"),
    "GreatVibes-Regular": require("@/assets/fonts/GreatVibes-Regular.ttf"),
  });

  useEffect(() => {
    initSocket();

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("carelink-emergency-v2", {
        name: "CareLink Critical Emergency",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500, 200, 1000],
        sound: "alert_sound.wav",
        enableLights: true,
        lightColor: "#EF4444",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        showBadge: true,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
          flags: {
            enforceAudibility: true,
            requestHardwareAudioVideoSynchronization: false,
          },
        },
      });

      Notifications.setNotificationChannelAsync("carelink-alerts", {
        name: "CareLink Alerts",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        enableLights: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.NOTIFICATION,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        },
      });

      Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      // Diagnostic: Check and log all registered Android Notification Channels
      Notifications.getNotificationChannelsAsync().then((channels) => {
        console.log("🔔 [DIAGNOSTIC] Registered Android Notification Channels:");
        channels.forEach((ch) => {
          console.log(`  - Channel ID: "${ch.id}", Name: "${ch.name}", Importance: ${ch.importance}, Sound: "${ch.sound}", BypassDnd: ${ch.bypassDnd}`);
        });
      }).catch((e) => console.warn("Could not retrieve channels:", e));
    }
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <HapticsProvider>
            <EmergencyAlertProvider>
              <OnboardingProvider>
                <Stack screenOptions={{ headerShown: false }} />
                <StatusBar style="auto" />
              </OnboardingProvider>
            </EmergencyAlertProvider>
          </HapticsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}