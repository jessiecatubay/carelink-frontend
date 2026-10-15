import AccountActionsSection from "@/components/feature/nonpatient/settings/AccountActionsSection";
import AccountSection from "@/components/feature/nonpatient/settings/AccountSection";
import DataSecuritySection from "@/components/feature/nonpatient/settings/DataSecuritySection";
import EmergencySettingsSection from "@/components/feature/nonpatient/settings/EmergencySettingsSection";
import NonPatientSettingsHeader from "@/components/feature/nonpatient/settings/NonPatientSettingsHeader";
import NotificationsSection from "@/components/feature/nonpatient/settings/NotificationsSection";
import PatientManagementSection from "@/components/feature/nonpatient/settings/PatientManagementSection";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NonPatientSettingsScreen() {
  const { user, updateUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const res = await axiosInstance.post("/api/user/v1/get-user-by-id", {
        id: user.id,
      });
      if (res.data?.data) {
        await updateUser(res.data.data);
      }
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.log("Failed to refresh nonpatient settings:", error);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, updateUser]);

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <NonPatientSettingsHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
        bounces={true}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0AA7A8"]}
            tintColor="#0AA7A8"
          />
        }
      >
        <AccountSection key={`account-${refreshKey}`} />
        <PatientManagementSection key={`patient-mgmt-${refreshKey}`} />
        <NotificationsSection />
        <EmergencySettingsSection />
        <DataSecuritySection />
        <AccountActionsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
});
