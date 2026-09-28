import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import SettingsToggle from "@/components/feature/shared/settings/SettingsToggle";
import { useHaptics } from "@/context/HapticsContext";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

export default function NotificationsSection() {
  const {
    notificationsEnabled,
    alertSoundEnabled,
    updateNotificationsEnabled,
    updateAlertSoundEnabled,
  } = useNotificationSettings();
  const { hapticFeedbackEnabled, setHapticFeedbackEnabled } = useHaptics();

  return (
    <SettingsSection title="NOTIFICATIONS & FEEDBACK">
      <SettingsToggle
        icon="notifications-outline"
        title="Alert Notifications"
        subtitle="Receive notifications for CareLink activity and alerts"
        value={notificationsEnabled}
        onValueChange={updateNotificationsEnabled}
      />

      <SettingsToggle
        icon="volume-high-outline"
        title="Alert Sound"
        subtitle="Play sound when an alert is received"
        value={alertSoundEnabled}
        onValueChange={updateAlertSoundEnabled}
      />

      <SettingsToggle
        icon="radio-outline"
        title="Haptic Feedback"
        subtitle="Vibration response on button press"
        value={hapticFeedbackEnabled}
        onValueChange={setHapticFeedbackEnabled}
      />
    </SettingsSection>
  );
}