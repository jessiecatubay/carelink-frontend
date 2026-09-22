import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useRouter } from "expo-router";
import React from "react";

export default function PatientManagementSection() {
  const router = useRouter();

  return (
    <SettingsSection title="PATIENT MANAGEMENT">
      <SettingsItem
        icon="accessibility-outline"
        title="Manage Patient"
        subtitle="View patient profile, edit illness, notes"
        onPress={() => router.push("/(protected)/manage-patient")}
      />
      <SettingsItem
        icon="qr-code-outline"
        title="Device Pairing"
        subtitle="Scan or Input QR code"
        onPress={() => router.push("/(protected)/device-pairing")}
      />
    </SettingsSection>
  );
}
