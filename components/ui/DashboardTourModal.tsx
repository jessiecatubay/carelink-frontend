import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type TourStep = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  badgeColor: string;
  iconColor: string;
  highlightTarget?: string;
  tips?: string[];
};

export const CAREGIVER_TOUR_STEPS: TourStep[] = [
  {
    id: "patient_status",
    title: "Patient & Connection",
    subtitle: "Real-time Monitoring",
    description:
      "See which patient is active and check their live internet connection. Tap this card anytime to pair or switch patients.",
    icon: "person-circle-outline",
    badgeColor: "#E0F2FE",
    iconColor: "#0284C7",
    tips: ["Shows ONLINE / OFFLINE status", "Tap to pair device via QR code"],
  },
  {
    id: "vital_cards",
    title: "Real-Time Vitals",
    subtitle: "Heart Rate & Temperature",
    description:
      "Monitor live Heart Rate (BPM) and Temperature (°C) with dynamic historical trend graphs and normal threshold indicators.",
    icon: "heart-outline",
    badgeColor: "#FEE2E2",
    iconColor: "#EF4444",
    tips: ["Live sensor telemetry", "Safe range indicators (60-100 BPM)"],
  },
  {
    id: "patient_posture",
    title: "Safety & Posture",
    subtitle: "Fall & Movement Detection",
    description:
      "Know if your patient is sitting, standing, lying down, or if a sudden fall has been detected so you can respond quickly.",
    icon: "shield-checkmark-outline",
    badgeColor: "#ECFDF5",
    iconColor: "#10B981",
    tips: ["Automated fall detection", "Live orientation status"],
  },
  {
    id: "ai_and_alerts",
    title: "AI Help & Alerts",
    subtitle: "Instant Assistance",
    description:
      "Access CareLink AI for instant medical care suggestions and view critical alert notifications in one tap.",
    icon: "sparkles-outline",
    badgeColor: "#FEF3C7",
    iconColor: "#D97706",
    tips: ["24/7 AI Care Assistant", "Emergency notification logs"],
  },
  {
    id: "recent_activity",
    title: "Activity Log",
    subtitle: "History & Events",
    description:
      "Keep track of timestamped vital updates, emergency calls, and daily check-ins for complete peace of mind.",
    icon: "time-outline",
    badgeColor: "#F3E8FF",
    iconColor: "#9333EA",
    tips: ["Complete historical timeline", "Easy review for doctor visits"],
  },
];

export const PATIENT_TOUR_STEPS: TourStep[] = [
  {
    id: "remote_help",
    title: "One-Touch Help",
    subtitle: "Emergency & Assistance",
    description:
      "Tap Food, Water, Assistance, or Emergency to notify your connected caregiver immediately.",
    icon: "hand-left-outline",
    badgeColor: "#FEE2E2",
    iconColor: "#EF4444",
    tips: ["Instant caregiver notification", "One-touch urgent alert"],
  },
  {
    id: "remote_satisfied",
    title: "Clear Requests",
    subtitle: "Request Resolution",
    description:
      "When your caregiver has assisted you, tap 'Satisfied' to let them know everything is okay.",
    icon: "checkmark-done-circle-outline",
    badgeColor: "#ECFDF5",
    iconColor: "#10B981",
    tips: ["Updates caregiver status", "Clears active alarm"],
  },
];

type DashboardTourModalProps = {
  role?: "CAREGIVER" | "PATIENT";
  forceShow?: boolean;
  onClose?: () => void;
};

const STORAGE_KEY = "@carelink_dashboard_tour_completed_v1";

export default function DashboardTourModal({
  role = "CAREGIVER",
  forceShow = false,
  onClose,
}: DashboardTourModalProps) {
  const [visible, setVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = role === "PATIENT" ? PATIENT_TOUR_STEPS : CAREGIVER_TOUR_STEPS;
  const currentStep = steps[currentStepIndex];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  // Check if tour should be displayed
  useEffect(() => {
    const checkTourStatus = async () => {
      if (forceShow) {
        setVisible(true);
        return;
      }

      try {
        const completed = await AsyncStorage.getItem(STORAGE_KEY);
        if (!completed) {
          // Delay briefly to allow dashboard to render first
          const timer = setTimeout(() => {
            setVisible(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.log("Tour check error:", err);
      }
    };

    checkTourStatus();
  }, [forceShow]);

  // Trigger animation whenever step changes
  useEffect(() => {
    if (!visible) return;

    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    iconScale.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 60,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, currentStepIndex]);

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      console.log("Failed to save tour completion:", e);
    }
    setVisible(false);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!visible || !currentStep) return null;

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => {}} />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header row: Badge & Step count & Skip */}
          <View style={styles.topRow}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPillText}>
                Step {currentStepIndex + 1} of {steps.length}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleFinish}
              style={styles.skipButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.skipText}>Skip Guide</Text>
              <Ionicons name="close" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Icon Circle */}
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: currentStep.badgeColor,
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <Ionicons
              name={currentStep.icon}
              size={44}
              color={currentStep.iconColor}
            />
          </Animated.View>

          {/* Subtitle / Category */}
          <Text style={[styles.subtitle, { color: currentStep.iconColor }]}>
            {currentStep.subtitle.toUpperCase()}
          </Text>

          {/* Title */}
          <Text style={styles.title}>{currentStep.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{currentStep.description}</Text>

          {/* Tip bullets */}
          {currentStep.tips && currentStep.tips.length > 0 ? (
            <View style={styles.tipsContainer}>
              {currentStep.tips.map((tip, index) => (
                <View key={index} style={styles.tipRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#10B981"
                    style={styles.tipIcon}
                  />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            {steps.map((_, index) => {
              const active = index === currentStepIndex;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    active && [
                      styles.dotActive,
                      { backgroundColor: currentStep.iconColor },
                    ],
                  ]}
                />
              );
            })}
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionsRow}>
            {currentStepIndex > 0 ? (
              <TouchableOpacity
                onPress={handlePrev}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={18} color="#4B5563" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.primaryButton,
                { backgroundColor: currentStep.iconColor },
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? "Got it! Start Using" : "Next Feature"}
              </Text>
              <Ionicons
                name={isLastStep ? "checkmark" : "arrow-forward"}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    width: "100%",
    maxWidth: SCREEN_WIDTH > 400 ? 360 : 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
  },

  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  stepPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  skipText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  iconWrapper: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
    textAlign: "center",
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
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  tipsContainer: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    gap: 6,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tipIcon: {
    marginRight: 8,
  },

  tipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },

  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },

  actionsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },

  primaryButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
