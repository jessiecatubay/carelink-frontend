import SlideToCall911 from "@/components/ui/SlideToCall911";
import { triggerAppHaptic, triggerAppVibration } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface EmergencyModalData {
  patientId?: string;
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
  const router = useRouter();
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

  const patientName = data?.patientName || "Connected Patient";
  const timestamp = data?.timestamp || new Date().toLocaleTimeString();

  const handleCallPatient = () => {
    triggerAppHaptic("medium");
    if (data?.phoneNumber) {
      const clean = data.phoneNumber.replace(/[^0-9+]/g, "");
      Linking.openURL(`tel:${clean}`);
    }
  };

  const handleViewPatient = () => {
    triggerAppHaptic("heavy");
    onDismiss();
    try {
      router.push("/nonpatient/dashboard/manage-patients");
    } catch {
      router.push("/nonpatient/dashboard");
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
              🚨 EMERGENCY ALERT
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

            {/* Patient Name Section */}
            <Text style={styles.patientNameText}>
              {patientName}
            </Text>

            <Text style={styles.emergencyNeedsText}>
              needs emergency assistance.
            </Text>

            {/* Subtitle / Details */}
            <Text style={styles.activatedText}>
              The Patient has activated the Emergency button.
            </Text>

            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text style={styles.timeBadgeText}>{timestamp}</Text>
            </View>

            {/* Primary Action Buttons: VIEW PATIENT & ACKNOWLEDGE */}
            <View style={styles.actionButtonsContainer}>
              <Pressable
                accessibilityRole="button"
                onPress={handleViewPatient}
                style={styles.viewPatientBtn}
              >
                <Ionicons name="person" size={18} color="#FFFFFF" />
                <Text style={styles.viewPatientBtnText}>VIEW PATIENT</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleAcknowledge}
                style={styles.acknowledgeBtn}
              >
                <Ionicons
                  name="volume-mute-outline"
                  size={18}
                  color="#EF4444"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.acknowledgeBtnText}>ACKNOWLEDGE</Text>
              </Pressable>
            </View>

            {/* Direct Call to Patient */}
            {data?.phoneNumber ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleCallPatient}
                style={styles.callPatientBtn}
              >
                <Ionicons name="call" size={18} color="#FFFFFF" />
                <Text style={styles.callPatientBtnText}>
                  Direct Call ({patientName})
                </Text>
              </Pressable>
            ) : null}

            {/* Slide to Call 911 Component */}
            <View style={styles.sliderContainer}>
              <SlideToCall911 label="Slide to call 911 now" />
            </View>
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
  patientNameText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  emergencyNeedsText: {
    color: "#EF4444",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
    marginTop: 2,
    marginBottom: 8,
  },
  activatedText: {
    color: "#D1D5DB",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 18,
  },
  timeBadgeText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  viewPatientBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#12A5B5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  viewPatientBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  acknowledgeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  acknowledgeBtnText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  callPatientBtn: {
    width: "100%",
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#0AA7A8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  callPatientBtnText: {
    color: "#0AA7A8",
    fontSize: 14,
    fontWeight: "700",
  },
  sliderContainer: {
    width: "100%",
    marginTop: 4,
  },
});
