import PatientRemote from "@/components/feature/patient/dashboard/PatientRemote";
import ConnectPatientPromptModal from "@/components/ui/ConnectPatientPromptModal";
import DashboardTourModal from "@/components/ui/DashboardTourModal";
import { useAuth } from "@/context/AuthContext";
import { triggerAppHaptic } from "@/context/HapticsContext";
import axiosInstance from "@/hooks/lib/axios";
import { initSocket, onConnectionUpdated } from "@/hooks/lib/socket";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientDashboardHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  const checkFamilyConnections = useCallback(async () => {
    if (!user?.id) {
      setIsCheckingConnection(false);
      return;
    }
    try {
      // 1. Check connected caregivers
      const response = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connected-caregivers",
        { patientId: user.id },
      );

      const caregivers = response.data?.data;
      if (Array.isArray(caregivers) && caregivers.length > 0) {
        setShowConnectPrompt(false);
        setIsCheckingConnection(false);
        return;
      }

      // 2. Check connected-nonpatients
      const nonPatientsRes = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connected-nonpatients",
        { userId: user.id },
      );

      const connected = nonPatientsRes.data?.data;
      if (Array.isArray(connected) && connected.length > 0) {
        setShowConnectPrompt(false);
        setIsCheckingConnection(false);
        return;
      }

      // 3. Check get-user-by-id
      const userRes = await axiosInstance.post("/api/user/v1/get-user-by-id", {
        id: user.id,
      });
      const patientConnections = userRes.data?.data?.patientConnections;
      if (Array.isArray(patientConnections) && patientConnections.length > 0) {
        setShowConnectPrompt(false);
        setIsCheckingConnection(false);
        return;
      }

      setShowConnectPrompt(true);
    } catch (error) {
      console.log("Check patient family connections failed:", error);
      try {
        const userRes = await axiosInstance.post("/api/user/v1/get-user-by-id", {
          id: user.id,
        });
        const conns = userRes.data?.data?.patientConnections;
        if (Array.isArray(conns) && conns.length > 0) {
          setShowConnectPrompt(false);
          setIsCheckingConnection(false);
          return;
        }
      } catch (e) {
        // ignore
      }
      setShowConnectPrompt(true);
    } finally {
      setIsCheckingConnection(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      checkFamilyConnections();
    }, [checkFamilyConnections]),
  );

  useEffect(() => {
    checkFamilyConnections();
  }, [checkFamilyConnections]);

  useEffect(() => {
    initSocket();
    const off = onConnectionUpdated((payload) => {
      console.log("🔗 Real-time connection update received in Patient dashboard:", payload);
      checkFamilyConnections();
    });

    return () => {
      off();
    };
  }, [checkFamilyConnections]);

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

      {/* Connect to Family First Prompt Modal for New/Unconnected Patients */}
      <ConnectPatientPromptModal
        role="PATIENT"
        title="Connect to Family First"
        primaryButtonText="View QR Code"
        secondaryButtonText="Go to Settings"
        visible={!isCheckingConnection && showConnectPrompt}
        onPrimaryAction={() => {
          router.push("/patient/dashboard/qrcode");
        }}
        onSecondaryAction={() => {
          router.push("/patient/dashboard/settings");
        }}
        onOpenSettings={() => {
          router.push("/patient/dashboard/settings");
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
