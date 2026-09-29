import EmergencyCountdownModal from "@/components/ui/EmergencyCountdownModal";
import { useAuth } from "@/context/AuthContext";
import { triggerAppHaptic } from "@/context/HapticsContext";
import axiosInstance from "@/hooks/lib/axios";
import { initSocket, startPatientPresence } from "@/hooks/lib/socket";
import { patientCommand } from "@/services/monitor";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import RemoteButton from "./RemoteButton";

export default function PatientRemote() {
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Emergency Modal State
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // 5-Second Cooldown on Satisfied button
  const [satisfiedCooldown, setSatisfiedCooldown] = useState(0);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCooldownTimer = () => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }
  };

  const startSatisfiedCooldown = () => {
    clearCooldownTimer();
    setSatisfiedCooldown(5);

    let remaining = 5;
    cooldownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining >= 0) {
        setSatisfiedCooldown(remaining);
      }
      if (remaining <= 0) {
        clearCooldownTimer();
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearCooldownTimer();
    };
  }, []);

  const sendPatientCommand = async (commandLabel: string) => {
    if (!user?.id) {
      console.log("No authenticated user id");
      return;
    }

    try {
      const result = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connected-nonpatients",
        { userId: user.id },
      );
      const connectedNonpatients = result.data.data;
      await patientCommand(
        "ESP32-001",
        commandLabel.toUpperCase(),
        user.id,
        connectedNonpatients,
      );
    } catch (error) {
      console.error("Failed to send patient command:", error);
    }
  };

  const handlePress = async (label: string) => {
    if (!user) {
      console.log("No authenticated user");
      return;
    }

    if (label === "Emergency") {
      // Pop up the 5-second countdown modal
      setShowEmergencyModal(true);
      return;
    }

    if (label === "Satisfied") {
      if (satisfiedCooldown > 0) {
        triggerAppHaptic("warning");
        return;
      }
      clearCooldownTimer();
      setSatisfiedCooldown(0);
      setPendingRequest(null);
      setActiveAlert(null);
      await sendPatientCommand("Satisfied");
      return;
    }

    // Food, Water, Assistance
    setActiveAlert(label);
    setPendingRequest(label);

    // Start 5-second cooldown for Satisfied button
    startSatisfiedCooldown();

    await sendPatientCommand(label);
  };

  const handleConfirmEmergency = async () => {
    setShowEmergencyModal(false);
    setActiveAlert("Emergency");
    setPendingRequest("Emergency");
    startSatisfiedCooldown();
    await sendPatientCommand("Emergency");
  };

  const handleCancelEmergency = () => {
    setShowEmergencyModal(false);
  };

  useEffect(() => {
    if (pendingRequest) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [pendingRequest, fadeAnim]);

  useEffect(() => {
    const socket = initSocket();

    startPatientPresence();

    const handleAlert = (payload: any) => {
      console.log("🔥 PATIENT ALERT RECEIVED:", payload);
    };

    socket?.on("patientAlert", handleAlert);

    return () => {
      socket?.off("patientAlert", handleAlert);
    };
  }, []);

  const isLocked = Boolean(pendingRequest);

  const getPanelStyle = () => {
    switch (pendingRequest) {
      case "Water":
        return { backgroundColor: "#D4EBFD", borderColor: "#93C5FD" }; // Blue
      case "Food":
        return { backgroundColor: "#FCECE9", borderColor: "#FCA5A5" }; // Coral / Peach
      case "Assistance":
        return { backgroundColor: "#FDE8C7", borderColor: "#FCD34D" }; // Amber / Yellow
      case "Emergency":
        return { backgroundColor: "#FEE2E2", borderColor: "#F87171" }; // Red
      default:
        return { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" };
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Alert Banner */}
      {pendingRequest && (
        <Animated.View style={[styles.alertBanner, { opacity: fadeAnim }]}>
          <Text style={styles.alertBannerText}>
            {pendingRequest === "Emergency"
              ? "🚨 Emergency Alert Broadcasted!"
              : `✓ Alert Sent: ${pendingRequest}`}
          </Text>
        </Animated.View>
      )}

      {/* Floating Remote Panel */}
      <View style={[styles.remotePanel, getPanelStyle()]}>
        {/* Row 1 */}
        <View style={styles.row}>
          <RemoteButton
            label="Food"
            icon={require("@/assets/icons/food.png")}
            onPress={() => handlePress("Food")}
            cardStyle={styles.foodCard}
            disabled={isLocked}
          />
          <RemoteButton
            label="Water"
            icon={require("@/assets/icons/water.png")}
            onPress={() => handlePress("Water")}
            cardStyle={styles.waterCard}
            disabled={isLocked}
          />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <RemoteButton
            label="Assistance"
            icon={require("@/assets/icons/assistance.png")}
            onPress={() => handlePress("Assistance")}
            cardStyle={styles.assistanceCard}
            disabled={isLocked}
          />
          <RemoteButton
            label="Emergency"
            icon={require("@/assets/icons/emergency.png")}
            onPress={() => handlePress("Emergency")}
            isEmergency
          />
        </View>

        {/* Row 3 - Centered */}
        <View style={styles.rowCentered}>
          <RemoteButton
            label="Satisfied"
            icon={require("@/assets/icons/satisfied.png")}
            onPress={() => handlePress("Satisfied")}
            cardStyle={styles.satisfiedCard}
            cooldown={satisfiedCooldown}
          />
        </View>
      </View>

      {/* 5-Second Emergency Countdown Modal */}
      <EmergencyCountdownModal
        visible={showEmergencyModal}
        onCancel={handleCancelEmergency}
        onConfirm={handleConfirmEmergency}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  alertBanner: {
    position: "absolute",
    top: -60,
    backgroundColor: "#1F2937",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  alertBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  remotePanel: {
    backgroundColor: "#F3F4F6", // Off-white/light gray mockup card background
    borderRadius: 44,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 24,
  },
  rowCentered: {
    flexDirection: "row",
    justifyContent: "center",
  },
  foodCard: {
    backgroundColor: "#FCECE9",
  },
  waterCard: {
    backgroundColor: "#D4EBFD",
  },
  assistanceCard: {
    backgroundColor: "#FDE8C7",
  },
  satisfiedCard: {
    backgroundColor: "#D3F4DF",
  },
});
