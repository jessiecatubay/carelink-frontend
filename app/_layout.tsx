import { OnboardingProvider } from "@/context/OnboardingContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <OnboardingProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </OnboardingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}