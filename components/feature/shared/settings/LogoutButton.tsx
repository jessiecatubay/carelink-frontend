import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Alert } from "react-native";
import SettingsItem from "./SettingsItem";

export type LogoutButtonProps = {
  onLogout?: () => void;
};

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { signOut } = useAuth();

  const handleLogoutPress = () => {
    Alert.alert("Log out", "Are you sure you want to log out of CareLink?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          if (onLogout) {
            onLogout();
          } else {
            await signOut();
          }
        },
      },
    ]);
  };

  return (
    <SettingsItem
      destructive
      icon="log-out-outline"
      title="Logout"
      onPress={handleLogoutPress}
    />
  );
}
