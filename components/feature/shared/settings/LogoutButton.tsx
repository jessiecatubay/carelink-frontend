import LogoutConfirmModal from "@/components/ui/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import SettingsItem from "./SettingsItem";

export type LogoutButtonProps = {
  onLogout?: () => void;
};

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setLoading(true);
    try {
      if (onLogout) {
        onLogout();
      } else {
        await signOut();
      }
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <SettingsItem
        destructive
        icon="log-out-outline"
        title="Logout"
        onPress={() => setModalVisible(true)}
      />

      <LogoutConfirmModal
        visible={modalVisible}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

