import { triggerAppHaptic, triggerAppVibration } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type EmergencyCountdownModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function EmergencyCountdownModal({
  visible,
  onCancel,
  onConfirm,
}: EmergencyCountdownModalProps) {
  const [countdown, setCountdown] = useState(5);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    progressAnim.stopAnimation();
  };

  useEffect(() => {
    if (visible) {
      setCountdown(5);
      progressAnim.setValue(0);

      triggerAppHaptic("warning");
      triggerAppVibration([0, 100, 50, 100]);

      // Pop-in spring animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      // Top line progress fill from 0% to 100% in 5000ms
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      // Pulse ring animation
      Animated.loop(
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
      ).start();

      let remaining = 5;
      intervalRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          setCountdown(remaining);
          triggerAppHaptic("selection");
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        clearTimers();
        onConfirm();
      }, 5000);
    } else {
      clearTimers();
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      pulseAnim.setValue(1);
    }

    return () => {
      clearTimers();
    };
  }, [visible]);

  const handleCancelPress = () => {
    clearTimers();
    triggerAppHaptic("medium");
    onCancel();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancelPress}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleCancelPress} />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Top Line Progress Bar (matches user mockup) */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          {/* Emergency Beacon Icon */}
          <View style={styles.iconOuterRing}>
            <Animated.View
              style={[
                styles.iconPulseRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.iconInnerBadge}>
              <Ionicons name="warning" size={38} color="#DC2626" />
            </View>
          </View>

          {/* Title & Countdown */}
          <Text style={styles.title}>EMERGENCY SOS</Text>
          <Text style={styles.subtitle}>
            Sending emergency alert in
          </Text>

          {/* Giant Countdown Badge */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownNumber}>0{countdown}</Text>
            <Text style={styles.countdownUnit}>SEC</Text>
          </View>

          <Text style={styles.message}>
            Caregivers and emergency contacts will be notified immediately.
          </Text>

          {/* Prominent Cancel Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cancelButton}
            onPress={handleCancelPress}
          >
            <Ionicons
              name="close-circle"
              size={22}
              color="#FFFFFF"
              style={styles.cancelIcon}
            />
            <Text style={styles.cancelButtonText}>Cancel Emergency</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    overflow: "hidden",
  },
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#FEE2E2",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#EF4444",
  },
  iconOuterRing: {
    width: 86,
    height: 86,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 14,
  },
  iconPulseRing: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FEE2E2",
    opacity: 0.8,
  },
  iconInnerBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FEF2F2",
    borderWidth: 2,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#991B1B",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 10,
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 14,
  },
  countdownNumber: {
    fontSize: 42,
    fontWeight: "900",
    color: "#DC2626",
    letterSpacing: -1,
  },
  countdownUnit: {
    fontSize: 14,
    fontWeight: "800",
    color: "#EF4444",
    marginLeft: 6,
  },
  message: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  cancelButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#DC2626",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  cancelIcon: {
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
