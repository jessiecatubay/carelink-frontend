import AccountActionsSection from "@/components/feature/nonpatient/settings/AccountActionsSection";
import AccountSection from "@/components/feature/nonpatient/settings/AccountSection";
import DataSecuritySection from "@/components/feature/nonpatient/settings/DataSecuritySection";
import EmergencySettingsSection from "@/components/feature/nonpatient/settings/EmergencySettingsSection";
import NonPatientSettingsHeader from "@/components/feature/nonpatient/settings/NonPatientSettingsHeader";
import NotificationsSection from "@/components/feature/nonpatient/settings/NotificationsSection";
import PatientManagementSection from "@/components/feature/nonpatient/settings/PatientManagementSection";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NonPatientSettingsScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <NonPatientSettingsHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AccountSection />
        <PatientManagementSection />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
});
