import SettingsHeader from "@/components/feature/shared/settings/SettingsHeader";
import React from "react";

export type PatientSettingsHeaderProps = {
  title?: string;
  onBack?: () => void;
};

export default function PatientSettingsHeader({
  title = "Settings",
  onBack,
}: PatientSettingsHeaderProps) {
  return (
    <SettingsHeader
      title={title}
      onBack={onBack}
      fallbackRoute="/patient/dashboard"
    />
  );
}
