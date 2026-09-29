import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useAuth } from "@/context/AuthContext";
import { capitalizeWords } from "@/utils/string";
import { useRouter } from "expo-router";
import React from "react";

export default function AccountSection() {
  const router = useRouter();
  const { user } = useAuth();

  const isGoogleUser = Boolean(user?.googleId && !user?.hasPassword);

  const fullName =
    capitalizeWords([user?.firstName, user?.lastName].filter(Boolean).join(" ")) ||
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
        icon={isGoogleUser ? "logo-google" : "lock-closed-outline"}
        title={isGoogleUser ? "Password (Google Account)" : "Change Password"}
        subtitle={
          isGoogleUser
            ? "Managed securely by Google"
            : "Update your security password"
        }
        onPress={() => router.push("/(protected)/change-password")}
      />
    </SettingsSection>
  );
}
