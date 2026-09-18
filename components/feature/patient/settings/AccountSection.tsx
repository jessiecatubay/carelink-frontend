import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";

export default function AccountSection() {
  const router = useRouter();
  const { user } = useAuth();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Patient Resident";
  const email = user?.email || "patient@carelink.com";

  return (
    <SettingsSection title="ACCOUNT">
      <SettingsItem
        icon="person-outline"
        title="Profile"
        subtitle={`${fullName}\n${email}`}
        onPress={() => router.push("/(protected)/profile")}
      />
      <SettingsItem
        icon="lock-closed-outline"
        title="Change Password"
        subtitle="Update your security password"
        onPress={() => router.push("/(protected)/change-password")}
      />
      <SettingsItem
        icon="qr-code-outline"
        title="My QR Code"
        subtitle="Show pairing code for caregiver & family"
        onPress={() => router.push("/(protected)/my-qr-code")}
      />
    </SettingsSection>
  );
}
