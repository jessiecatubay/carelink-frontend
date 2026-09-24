import { useEffect, useState } from "react";
import {
  getNotificationSettings,
  setAlertSoundEnabled,
  setNotificationsEnabled,
} from "@/hooks/lib/notification-settings";

export function useNotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabledState] =
    useState(true);

  const [alertSoundEnabled, setAlertSoundEnabledState] =
    useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getNotificationSettings();

        setNotificationsEnabledState(settings.notificationsEnabled);
        setAlertSoundEnabledState(settings.alertSoundEnabled);
      } catch (error) {
        console.error("Failed to load notification settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateNotificationsEnabled = async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    await setNotificationsEnabled(enabled);
  };

  const updateAlertSoundEnabled = async (enabled: boolean) => {
    setAlertSoundEnabledState(enabled);
    await setAlertSoundEnabled(enabled);
  };

  return {
    notificationsEnabled,
    alertSoundEnabled,
    loading,
    updateNotificationsEnabled,
    updateAlertSoundEnabled,
  };
}