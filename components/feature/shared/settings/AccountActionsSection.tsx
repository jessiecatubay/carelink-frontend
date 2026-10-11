import LogoutButton from "@/components/feature/shared/settings/LogoutButton";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import React from "react";

export default function AccountActionsSection() {
  return (
    <SettingsSection title="ACCOUNT ACTIONS">
      <LogoutButton />
    </SettingsSection>
  );
}
