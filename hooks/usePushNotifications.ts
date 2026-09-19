import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import axiosInstance from "@/hooks/lib/axios";
import { useAuth } from "@/context/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    registerForPushNotifications();
  }, [user?.id]);

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log(
        "Push notifications require a physical device."
      );

      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log(
        "Notification permission was not granted."
      );

      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log("Expo project ID not found.");
      return;
    }

    const token =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    await axiosInstance.post(
      "/api/notification/v1/register-token",
      {
        token: token.data,
        platform: Platform.OS,
      }
    );

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "default",
          importance:
            Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: "default",
        }
      );
    }

    console.log(
      "Expo push token registered:",
      token.data
    );
  }
}