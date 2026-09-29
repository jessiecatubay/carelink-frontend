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
  onEnterCode?: () => void;
  onManualPair?: () => void;
  onOpenSettings?: () => void;
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
  onEnterCode,
  onManualPair,
  onOpenSettings,
}: ConnectPatientPromptModalProps) {
  if (!visible) return null;

  const isPatient = role === "PATIENT";

  const resolvedTitle =
    title || (isPatient ? "Connect to Family First" : "Connect a Patient First");

  const resolvedDescription =
    description ||
    (isPatient
      ? "Welcome to CareLink! To share your status and send emergency alerts or requests to your caregivers and loved ones, please connect to a family member first."
      : "Welcome to CareLink! To start monitoring real-time vitals, posture, and receiving emergency alerts, please connect to a patient device.");

  const resolvedPrimaryText =
    primaryButtonText ||
    (isPatient ? "View QR Code" : "Scan Patient QR Code");

  const resolvedSecondaryText =
    secondaryButtonText ||
    (isPatient ? "Go to Settings" : "Enter Patient Code");

  const handleScanOrPrimary = onScanQR || onPrimaryAction || (() => {});
  const handleEnterCodeOrSecondary = onEnterCode || onManualPair || onSecondaryAction || (() => {});
  const handleSettings = onOpenSettings || (isPatient ? handleEnterCodeOrSecondary : () => {});

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
              name={isPatient ? "qr-code-outline" : "link-outline"}
              size={40}
              color="#0AA7A8"
            />
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>{resolvedTitle}</Text>
          <Text style={styles.description}>{resolvedDescription}</Text>

          {isPatient ? (
            /* Patient Side Actions */
            <View style={styles.patientButtonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleScanOrPrimary}
                activeOpacity={0.85}
              >
                <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>{resolvedPrimaryText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tertiaryButton}
                onPress={handleSettings}
                activeOpacity={0.8}
              >
                <Ionicons name="settings-outline" size={18} color="#475569" />
                <Text style={styles.tertiaryButtonText}>Go to Settings</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Non-Patient Side Actions */
            <View style={styles.buttonContainer}>
              {/* 1. SCAN PATIENT QR CODE */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleScanOrPrimary}
                activeOpacity={0.85}
              >
                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Scan Patient QR Code</Text>
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* 2. ENTER PATIENT CODE */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleEnterCodeOrSecondary}
                activeOpacity={0.8}
              >
                <Ionicons name="keypad-outline" size={18} color="#0AA7A8" />
                <Text style={styles.secondaryButtonText}>Enter Patient Code</Text>
              </TouchableOpacity>

              {/* 3. GO TO SETTINGS */}
              {onOpenSettings && (
                <TouchableOpacity
                  style={[styles.tertiaryButton, styles.nonPatientSettingsButton]}
                  onPress={handleSettings}
                  activeOpacity={0.8}
                >
                  <Ionicons name="settings-outline" size={18} color="#475569" />
                  <Text style={styles.tertiaryButtonText}>Go to Settings</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
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
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },

  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#EAF9F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#CCFBF1",
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  patientButtonContainer: {
    width: "100%",
    gap: 12,
  },

  buttonContainer: {
    width: "100%",
  },

  primaryButton: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#0AA7A8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
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

  tertiaryButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  nonPatientSettingsButton: {
    marginTop: 10,
  },

  tertiaryButtonText: {
    color: "#475569",
    fontSize: 14.5,
    fontWeight: "600",
  },
});

