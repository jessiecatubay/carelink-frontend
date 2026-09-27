import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type ConnectPatientPromptModalProps = {
  visible: boolean;
  role?: "PATIENT" | "NON_PATIENT";
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onScanQR?: () => void;
  onManualPair?: () => void;
};

export default function ConnectPatientPromptModal({
  visible,
  role = "NON_PATIENT",
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  onScanQR,
  onManualPair,
}: ConnectPatientPromptModalProps) {
  if (!visible) return null;

  const isPatient = role === "PATIENT";

  const resolvedTitle =
    title || (isPatient ? "Connect a Family First" : "Connect a Patient First");

  const resolvedDescription =
    description ||
    (isPatient
      ? "Welcome to CareLink! Connect with your family member or caregiver so they can receive your emergency alerts, requests, and stay updated in real time."
      : "Welcome to CareLink! To start monitoring real-time vitals, posture, and receiving emergency alerts, please connect to a patient device.");

  const resolvedPrimaryText =
    primaryButtonText ||
    (isPatient ? "Show My QR Code" : "Scan Patient QR Code");

  const resolvedSecondaryText =
    secondaryButtonText ||
    (isPatient ? "Go to Dashboard" : "Manage / Enter Code");

  const handlePrimary = onPrimaryAction || onScanQR || (() => {});
  const handleSecondary = onSecondaryAction || onManualPair || (() => {});

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} />

        <View style={styles.card}>
          {/* Glowing Icon Badge */}
          <View style={styles.iconCircle}>
            <Ionicons
              name={isPatient ? "people-outline" : "qr-code-outline"}
              size={42}
              color="#0AA7A8"
            />
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>{resolvedTitle}</Text>
          <Text style={styles.description}>{resolvedDescription}</Text>

          {/* Primary Action */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrimary}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isPatient ? "qr-code-outline" : "camera-outline"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.primaryButtonText}>{resolvedPrimaryText}</Text>
          </TouchableOpacity>

          {/* Secondary Action */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSecondary}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isPatient ? "arrow-forward-outline" : "people-outline"}
              size={18}
              color="#0AA7A8"
            />
            <Text style={styles.secondaryButtonText}>
              {resolvedSecondaryText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EAF9F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#CCFBF1",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 4,
  },

  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0AA7A8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F0FDFA",
    borderWidth: 1.5,
    borderColor: "#99F6E4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  secondaryButtonText: {
    color: "#0AA7A8",
    fontSize: 15,
    fontWeight: "700",
  },
});

