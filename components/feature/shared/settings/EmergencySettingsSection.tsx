import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useRouter } from "expo-router";
import React from "react";

export type EmergencySettingsSectionProps = {
  subtitle?: string;
};

export default function EmergencySettingsSection({
  subtitle = "Manage and view emergency contact numbers",
}: EmergencySettingsSectionProps) {
  const router = useRouter();

  return (
    <SettingsSection title="EMERGENCY SETTINGS">
      <SettingsItem
        icon="call-outline"
        title="Emergency Contacts"
        subtitle={subtitle}
        onPress={() => router.push("/(protected)/emergency-contacts")}
      />
    </SettingsSection>
  );
}
