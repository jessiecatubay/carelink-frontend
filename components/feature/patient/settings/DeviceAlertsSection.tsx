import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import SettingsToggle from "@/components/feature/shared/settings/SettingsToggle";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DeviceAlertsSection() {
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  return (
    <SettingsSection title="DEVICE & ALERTS">
      <SettingsToggle
        icon="volume-high-outline"
        title="Alert Sound"
        subtitle="Play audible chime on alert selection"
        value={alertSoundEnabled}
        onValueChange={setAlertSoundEnabled}
      />
      <SettingsToggle
        icon="radio-outline"
        title="Haptic Feedback"
        subtitle="Vibration response on button press"
        value={hapticFeedback}
        onValueChange={setHapticFeedback}
      />
      <SettingsItem
        icon="shield-checkmark-outline"
        title="Emergency Alert Service"
        subtitle="Active 24/7 monitored connection"
        trailing={
          <View style={styles.alwaysOnBadge}>
            <Text style={styles.alwaysOnText}>Always on</Text>
          </View>
        }
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
