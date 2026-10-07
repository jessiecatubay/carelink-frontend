import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type FeatureHighlightStep = {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  themeColor: string;
  tips: string[];
};

export const CAREGIVER_FEATURE_STEPS: FeatureHighlightStep[] = [
  {
    id: "patient_card",
    stepNumber: 1,
    title: "Patient Status & Connection",
    subtitle: "Active Patient Profile & Status",
    description:
      "This is your Patient Status card. It shows your connected patient's name and live cloud connectivity (ONLINE / OFFLINE). Tap anytime to manage or switch patients.",
    icon: "person-circle-outline",
    themeColor: "#0284C7",
    tips: [
      "View live device connectivity",
      "Tap to switch or add more patients",
    ],
  },
  {
    id: "current_vitals",
    stepNumber: 2,
    title: "Real-Time Patient Vitals",
    subtitle: "Heart Rate & Body Temperature",
    description:
      "This shows the heart rate (BPM) and body temperature (°C) of the patient in real time. Live charts help you spot irregular vitals or fever spikes immediately.",
    icon: "heart-outline",
    themeColor: "#F16A66",
    tips: [
      "Normal Heart Rate: 60 - 100 BPM",
      "Normal Body Temp: 36.0 - 37.5 °C",
    ],
  },
  {
    id: "patient_status",
    stepNumber: 3,
    title: "Patient Posture & Safety",
    subtitle: "Fall Detection & Body Orientation",
    description:
      "Monitors whether the patient is sitting, standing, or lying down. If an accidental fall occurs, CareLink instantly triggers a high-priority safety alert.",
    icon: "shield-checkmark-outline",
    themeColor: "#10B981",
    tips: [
      "Real-time fall detection monitoring",
      "Live sitting/standing orientation",
    ],
  },
  {
    id: "quick_actions",
    stepNumber: 4,
    title: "Patient Notifications & AI Help",
    subtitle: "Button Alerts & Emergency Assistance",
    description:
      "View urgent patient notifications (Emergency, Food, Water, Assistance) and get instant step-by-step care guidance from the CareLink AI Assistant.",
    icon: "sparkles-outline",
    themeColor: "#D97706",
    tips: [
      "Instant notification of patient alerts",
      "Consult AI Care Assistant for advice",
    ],
  },
  {
    id: "recent_activity",
    stepNumber: 5,
    title: "Recent Activity Log",
    subtitle: "Complete Care Timeline",
    description:
      "A complete timestamped log of all alert requests, posture changes, vital syncs, and daily caregiver check-ins.",
    icon: "time-outline",
    themeColor: "#8B5CF6",
    tips: [
      "Timestamped logs for doctor visits",
      "Track daily routine & care check-ins",
    ],
  },
];

type DashboardFeatureTourProps = {
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
};

export default function DashboardFeatureTour({
  currentStepIndex,
  onNext,
  onPrev,
  onFinish,
}: DashboardFeatureTourProps) {
  const step = CAREGIVER_FEATURE_STEPS[currentStepIndex];
  if (!step) return null;

  const totalSteps = CAREGIVER_FEATURE_STEPS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <View style={styles.floatingCardWrapper}>
      <View style={styles.card}>
        {/* Header: Step Pill & Close */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.stepBadge,
              { backgroundColor: step.themeColor + "18" },
            ]}
          >
            <Text style={[styles.stepBadgeText, { color: step.themeColor }]}>
              FEATURE GUIDE {step.stepNumber} OF {totalSteps}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onFinish}
            style={styles.skipButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.skipText}>Skip Guide</Text>
            <Ionicons name="close-circle-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Title and Icon */}
        <View style={styles.titleRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: step.themeColor + "1A" },
            ]}
          >
            <Ionicons name={step.icon} size={26} color={step.themeColor} />
          </View>
          <View style={styles.titleCol}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={[styles.subtitle, { color: step.themeColor }]}>
              {step.subtitle}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{step.description}</Text>

        {/* Tips Box */}
        <View style={styles.tipsBox}>
          {step.tips.map((tip, idx) => (
            <View key={idx} style={styles.tipRow}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color="#10B981"
                style={styles.tipIcon}
              />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Step Indicator Dots */}
        <View style={styles.dotsRow}>
          {CAREGIVER_FEATURE_STEPS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentStepIndex && [
                  styles.dotActive,
                  { backgroundColor: step.themeColor },
                ],
              ]}
            />
          ))}
        </View>

        {/* Controls: Back & Next */}
        <View style={styles.actionsRow}>
          {currentStepIndex > 0 ? (
            <TouchableOpacity
              onPress={onPrev}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={16} color="#4B5563" />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 70 }} />
          )}

          <TouchableOpacity
            onPress={onNext}
            style={[styles.nextBtn, { backgroundColor: step.themeColor }]}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {isLastStep ? "Complete Tour" : "Next Feature"}
            </Text>
            <Ionicons
              name={isLastStep ? "checkmark" : "arrow-forward"}
              size={16}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingCardWrapper: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 9999,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  stepBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  skipText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  titleCol: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 1,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#4B5563",
    marginBottom: 10,
  },

  tipsBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    marginBottom: 12,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tipIcon: {
    marginRight: 6,
  },

  tipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 12,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E5E7EB",
  },

  dotActive: {
    width: 16,
    height: 5,
    borderRadius: 2.5,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    gap: 4,
  },

  backBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },

  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
