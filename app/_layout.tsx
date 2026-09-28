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

    const data = notification.request.content.data as {
      type?: string;
      command?: string;
      alertType?: string;
    };

    const isEmergency =
      data?.type === "EMERGENCY" ||
      data?.command === "EMERGENCY" ||
      data?.alertType === "Emergency";

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
      Notifications.setNotificationChannelAsync("carelink-emergency", {
        name: "CareLink Critical Emergency",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500, 200, 1000],
        sound: "default",
        enableLights: true,
        lightColor: "#EF4444",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });

      Notifications.setNotificationChannelAsync("carelink-alerts", {
        name: "CareLink Alerts",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        enableLights: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
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