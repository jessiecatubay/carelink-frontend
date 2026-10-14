import SettingsHeader from "@/components/feature/shared/settings/SettingsHeader";
import React from "react";

export type NonPatientSettingsHeaderProps = {
  title?: string;
  onBack?: () => void;
};

export default function NonPatientSettingsHeader({
  title = "Settings",
  onBack,
}: NonPatientSettingsHeaderProps) {
  return (
    <SettingsHeader
      title={title}
      onBack={onBack}
      fallbackRoute="/nonpatient/dashboard"
    />
  );
}
