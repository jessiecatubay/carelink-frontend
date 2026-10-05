import SettingsItem from "@/components/feature/shared/settings/SettingsItem";
import SettingsSection from "@/components/feature/shared/settings/SettingsSection";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { initSocket, onConnectionUpdated } from "@/hooks/lib/socket";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ConnectedCaregiversSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [connectedCount, setConnectedCount] = useState<number | null>(null);

  const fetchConnectedCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connected-caregivers",
        { patientId: user.id },
      );
      const data = response.data?.data;
      if (Array.isArray(data)) {
        setConnectedCount(data.length);
      }
    } catch (e) {
      // Silently fallback if fetch fails
    }
  }, [user?.id]);

  useEffect(() => {
    fetchConnectedCount();
  }, [fetchConnectedCount]);

  useEffect(() => {
    initSocket();
    const off = onConnectionUpdated(() => {
      fetchConnectedCount();
    });

    return () => {
      off();
    };
  }, [fetchConnectedCount]);

  return (
    <SettingsSection title="ALERT RECIPIENTS & CAREGIVERS">
      <SettingsItem
        icon="people-outline"
        title="Connected Caregivers"
        subtitle="View users who receive notifications when you press alerts"
        onPress={() => router.push("/(protected)/connected-caregivers")}
        trailing={
          connectedCount !== null && connectedCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {connectedCount} {connectedCount === 1 ? "Connected" : "Connected"}
              </Text>
            </View>
          ) : undefined
        }
      />
      <SettingsItem
        icon="qr-code-outline"
        title="Pair via QR Code"
        subtitle="Show your pairing code to connect another family member"
        onPress={() => router.push("/(protected)/my-qr-code")}
      />
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#EDFBFB",
    borderColor: "#0AA7A8",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#0AA7A8",
    fontSize: 11,
    fontWeight: "700",
  },
});
