import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useAuth } from "@/context/AuthContext";
import { capitalizeWords } from "@/utils/string";
import { useRouter } from "expo-router";
import React from "react";

export type AccountSectionProps = {
  defaultRoleName?: string;
  showPhone?: boolean;
};

export default function AccountSection({
  defaultRoleName,
  showPhone,
}: AccountSectionProps = {}) {
  const router = useRouter();
  const { user } = useAuth();

  const isGoogleUser = Boolean(user?.googleId && !user?.hasPassword);
  const isNonPatient = user?.role === "NON_PATIENT";

  const defaultRole =
    defaultRoleName || (isNonPatient ? "Caregiver / Family" : "Patient Resident");
  const defaultEmail = isNonPatient
    ? "caregiver@carelink.com"
    : "patient@carelink.com";

  const fullName =
    capitalizeWords([user?.firstName, user?.lastName].filter(Boolean).join(" ")) ||
    defaultRole;
  const email = user?.email || defaultEmail;
  const shouldDisplayPhone = showPhone ?? isNonPatient;
  const phone = user?.emergencyContact || "+63 900 000 0000";

  const subtitle = shouldDisplayPhone
    ? `${fullName}\n${email}\n${phone}`
    : `${fullName}\n${email}`;

  return (
    <SettingsSection title="ACCOUNT">
      <SettingsItem
        icon="person-outline"
        title="Profile"
        subtitle={subtitle}
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
