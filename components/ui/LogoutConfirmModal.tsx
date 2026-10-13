import CustomAlertModal from "@/components/ui/CustomAlertModal";
import React from "react";

export type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
};

export default function LogoutConfirmModal({
  visible,
  onCancel,
  onConfirm,
  loading = false,
  title = "Log Out of CareLink?",
  message = "Are you sure you want to log out? You will need to sign back in to access real-time vital tracking and alerts.",
}: LogoutConfirmModalProps) {
  return (
    <CustomAlertModal
      visible={visible}
      type="logout"
      customIcon={require("@/assets/icons/logout.png")}
      isDestructive
      title={title}
      message={message}
      confirmText="Log Out"
      cancelText="Stay Signed In"
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onCancel}
      loading={loading}
    />
  );
}
