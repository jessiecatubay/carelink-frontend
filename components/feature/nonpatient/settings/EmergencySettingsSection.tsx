import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useRouter } from "expo-router";
import React from "react";

export default function EmergencySettingsSection() {
  const router = useRouter();

  return (
    <SettingsSection title="EMERGENCY SETTINGS">
      <SettingsItem
        icon="call-outline"
        title="Emergency Contacts"
        subtitle="Add or edit emergency contacts"
        onPress={() => router.push("/(protected)/emergency-contacts")}
      />
    </SettingsSection>
  );
}
