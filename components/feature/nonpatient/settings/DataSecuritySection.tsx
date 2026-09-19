import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useRouter } from "expo-router";
import React from "react";

export default function DataSecuritySection() {
  const router = useRouter();

  return (
    <SettingsSection title="DATA & SECURITY">
      <SettingsItem
        icon="document-text-outline"
        title="Terms & Conditions"
        subtitle="Read CareLink terms of service"
        onPress={() => router.push("/(protected)/terms-and-conditions")}
      />
      <SettingsItem
        icon="shield-checkmark-outline"
        title="Privacy Policy"
        subtitle="How your health data is protected"
        onPress={() => router.push("/(protected)/privacy-policy")}
      />
    </SettingsSection>
  );
}
