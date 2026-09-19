import AccountActionsSection from "@/components/feature/patient/settings/AccountActionsSection";
import AccountSection from "@/components/feature/patient/settings/AccountSection";
import DataSecuritySection from "@/components/feature/patient/settings/DataSecuritySection";
import DeviceAlertsSection from "@/components/feature/patient/settings/DeviceAlertsSection";
import EmergencySettingsSection from "@/components/feature/patient/settings/EmergencySettingsSection";
import PatientSettingsHeader from "@/components/feature/patient/settings/PatientSettingsHeader";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientSettingsScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <PatientSettingsHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AccountSection />
        <DeviceAlertsSection />
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
