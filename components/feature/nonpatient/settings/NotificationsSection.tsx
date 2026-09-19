import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import SettingsToggle from "@/components/feature/shared/settings/SettingsToggle";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotificationsSection() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(true);

  return (
    <SettingsSection title="NOTIFICATIONS">
      <SettingsToggle
        icon="notifications-outline"
        title="Notifications"
        subtitle="Push notifications for updates and activity"
        value={notificationsEnabled}
        onValueChange={setNotificationsEnabled}
      />
      <SettingsItem
        icon="notifications-off-outline"
        title="Emergency Alerts"
        subtitle="Critical emergency notifications"
        trailing={
          <View style={styles.alwaysOnBadge}>
            <Text style={styles.alwaysOnText}>Always on</Text>
          </View>
        }
      />
      <SettingsToggle
        icon="volume-high-outline"
        title="Alert Sound"
        subtitle="Play sound on emergency notifications"
        value={alertSoundEnabled}
        onValueChange={setAlertSoundEnabled}
      />
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  alwaysOnBadge: {
    backgroundColor: "#0AA7A8",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  alwaysOnText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
