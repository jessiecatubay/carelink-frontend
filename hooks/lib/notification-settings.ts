import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_KEY = "carelink_notifications_enabled";
const ALERT_SOUND_KEY = "carelink_alert_sound_enabled";

export async function getNotificationSettings() {
  const [notifications, sound] = await Promise.all([
    AsyncStorage.getItem(NOTIFICATIONS_KEY),
    AsyncStorage.getItem(ALERT_SOUND_KEY),
  ]);

  return {
    notificationsEnabled:
      notifications === null ? true : JSON.parse(notifications),
    alertSoundEnabled: sound === null ? true : JSON.parse(sound),
  };
}

export async function setNotificationsEnabled(enabled: boolean) {
  await AsyncStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(enabled),
  );
}

export async function setAlertSoundEnabled(enabled: boolean) {
  await AsyncStorage.setItem(
    ALERT_SOUND_KEY,
    JSON.stringify(enabled),
  );
}