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
    "Caregiver / Family";
  const email = user?.email || "caregiver@carelink.com";
  const phone = user?.phoneNumber || "+63 900 000 0000";

  return (
    <SettingsSection title="ACCOUNT">
      <SettingsItem
        icon="person-outline"
        title="Profile"
        subtitle={`${fullName}\n${email}\n${phone}`}
        onPress={() => router.push("/(protected)/profile")}
      />
      <SettingsItem
        icon="lock-closed-outline"
        title="Change Password"
        subtitle="Update your security password"
        onPress={() => router.push("/(protected)/change-password")}
      />
    </SettingsSection>
  );
}
