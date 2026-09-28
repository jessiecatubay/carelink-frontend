import PatientRemote from "@/components/feature/patient/dashboard/PatientRemote";
import ConnectPatientPromptModal from "@/components/ui/ConnectPatientPromptModal";
import DashboardTourModal from "@/components/ui/DashboardTourModal";
import { useAuth } from "@/context/AuthContext";
import { triggerAppHaptic } from "@/context/HapticsContext";
import axiosInstance from "@/hooks/lib/axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientDashboardHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const checkFamilyConnections = async () => {
      try {
        const response = await axiosInstance.post(
          "/api/patient-nonpatient/v1/connected-nonpatients",
          { userId: user.id },
        );

        const connected = response.data?.data;
        if (!connected || (Array.isArray(connected) && connected.length === 0)) {
          setShowConnectPrompt(true);
        }
      } catch (error) {
        console.log("Check patient family connections failed:", error);
        // Show prompt if not yet connected
        setShowConnectPrompt(true);
      }
    };

    checkFamilyConnections();
  }, [user?.id]);

  const handleOpenSettings = () => {
    triggerAppHaptic("light");
    router.push("/patient/dashboard/settings");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header with Centered Large Logo and Settings Icon on Upper Right */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={12}
            onPress={handleOpenSettings}
            style={styles.settingsButton}
          >
            <Image
              source={require("@/assets/icons/settings.png")}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Interactive Remote Control */}
        <View style={styles.content}>
          <PatientRemote />
        </View>
      </View>

      {/* Connect a Family First Prompt Modal for New/Unconnected Patients */}
      <ConnectPatientPromptModal
        role="PATIENT"
        visible={showConnectPrompt}
        onPrimaryAction={() => {
          setShowConnectPrompt(false);
          router.push("/patient/dashboard/qrcode");
        }}
        onSecondaryAction={() => {
          setShowConnectPrompt(false);
        }}
      />

      {/* Interactive Feature Walkthrough Guide for New Patient Users */}
      <DashboardTourModal role="PATIENT" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    minHeight: 85,
    position: "relative",
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FDFA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
    zIndex: 10,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: "#0AA7A8",
  },
  logo: {
    width: 280,
    height: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
