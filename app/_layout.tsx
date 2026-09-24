import { useEffect } from "react";
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
        shouldPlaySound: settings.alertSoundEnabled,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    }

    if (!settings.notificationsEnabled) {
      return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }

    return {
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
          <OnboardingProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}