import SettingsToggle from "@/components/feature/shared/settings/SettingsToggle";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

export default function NotificationsSection() {
  const {
    notificationsEnabled,
    alertSoundEnabled,
    updateNotificationsEnabled,
    updateAlertSoundEnabled,
  } = useNotificationSettings();

  return (
    <SettingsSection title="NOTIFICATIONS">
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
    </SettingsSection>
  );
}