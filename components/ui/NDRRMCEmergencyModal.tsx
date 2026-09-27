import SlideToCall911 from "@/components/ui/SlideToCall911";
import { triggerAppHaptic, triggerAppVibration } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface EmergencyModalData {
  patientName?: string;
  alertType?: string;
  timestamp?: string;
  phoneNumber?: string;
}

interface NDRRMCEmergencyModalProps {
  visible: boolean;
  data?: EmergencyModalData | null;
  onDismiss: () => void;
}

export default function NDRRMCEmergencyModal({
  visible,
  data,
  onDismiss,
}: NDRRMCEmergencyModalProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0.6)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  // Continuous siren visual & vibration loop while modal is open
  useEffect(() => {
    if (!visible) return;

    // Trigger aggressive initial SOS vibration
    triggerAppVibration([0, 600, 200, 600, 200, 1000]);

    const vibrationInterval = setInterval(() => {
      triggerAppVibration([0, 500, 200, 500, 200, 800]);
    }, 2800);

    // Flashing emergency strobe animation
    const flashLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    // Pulsating center beacon animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    );

    // Expanding radar ripple wave
    const rippleLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(rippleAnim, {
          toValue: 2.2,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    );

    flashLoop.start();
    pulseLoop.start();
    rippleLoop.start();

    return () => {
      clearInterval(vibrationInterval);
      flashLoop.stop();
      pulseLoop.stop();
      rippleLoop.stop();
    };
  }, [visible]);

  if (!visible) return null;

  const patientName = data?.patientName || "Patient";
  const alertType = data?.alertType || "EMERGENCY SOS";
  const timestamp = data?.timestamp || new Date().toLocaleTimeString();

  const handleCallPatient = () => {
    triggerAppHaptic("medium");
    if (data?.phoneNumber) {
      const clean = data.phoneNumber.replace(/[^0-9+]/g, "");
      Linking.openURL(`tel:${clean}`);
    }
  };

  const handleAcknowledge = () => {
    triggerAppHaptic("heavy");
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        {/* Fullscreen Strobe Red Ambient Flash */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ambientStrobe,
            {
              opacity: flashAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.15, 0.45],
              }),
            },
          ]}
        />

        <View style={styles.dialogCard}>
          {/* Top Warning Hazard Header */}
          <View style={styles.hazardHeader}>
            <View style={styles.hazardDot} />
            <Text style={styles.hazardHeaderText}>
              EMERGENCY BROADCAST ALERT
            </Text>
            <View style={styles.hazardDot} />
          </View>

          <ScrollView
            contentContainerStyle={styles.cardContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Center Pulsating Siren Beacon */}
            <View style={styles.beaconContainer}>
              <Animated.View
                style={[
                  styles.beaconRipple,
                  {
                    transform: [{ scale: rippleAnim }],
                    opacity: rippleOpacity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.beaconCore,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Ionicons name="warning" size={44} color="#FFFFFF" />
              </Animated.View>
            </View>

            {/* Emergency Title */}
            <Text style={styles.emergencyTitle}>
              CRITICAL EMERGENCY TRIGGERED
            </Text>

            {/* Broadcast Details Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ALERT TYPE</Text>
                <Text style={styles.infoValueAlert}>{alertType}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ORIGINATING USER</Text>
                <Text style={styles.infoValueText}>{patientName}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>BROADCAST TIME</Text>
                <Text style={styles.infoValueText}>{timestamp}</Text>
              </View>
            </View>

            <Text style={styles.alertInstructions}>
              Immediate assistance required. Please verify patient status or
              dial emergency services below.
            </Text>

            {/* Slide to Call 911 Component */}
            <View style={styles.sliderContainer}>
              <SlideToCall911 label="Slide to call 911 now" />
            </View>

            {/* Direct Action Buttons */}
            {data?.phoneNumber ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleCallPatient}
                style={styles.callPatientBtn}
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
                <Text style={styles.callPatientBtnText}>
                  Direct Call ({patientName})
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleAcknowledge}
              style={styles.dismissBtn}
            >
              <Ionicons
                name="volume-mute-outline"
                size={20}
                color="#EF4444"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.dismissBtnText}>
                Acknowledge & Silence Alarm
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    zIndex: 99999,
  },
  ambientStrobe: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EF4444",
  },
  dialogCard: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
    backgroundColor: "#111827",
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: "#EF4444",
    overflow: "hidden",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 20,
  },
  hazardHeader: {
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  hazardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  hazardHeaderText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  cardContent: {
    alignItems: "center",
    padding: 24,
  },
  beaconContainer: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  beaconRipple: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(239, 68, 68, 0.5)",
  },
  beaconCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  emergencyTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 16,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#374151",
    padding: 16,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoValueAlert: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "900",
  },
  infoValueText: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 6,
  },
  alertInstructions: {
    color: "#D1D5DB",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  sliderContainer: {
    width: "100%",
    marginBottom: 10,
  },
  callPatientBtn: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0AA7A8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  callPatientBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  dismissBtn: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  dismissBtnText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});
