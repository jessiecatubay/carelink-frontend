import { registerForPushNotificationsAsync } from "@/hooks/lib/notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function PatientDashboardLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync().catch((error) => {
      console.error("Patient push notification registration error:", error);
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
