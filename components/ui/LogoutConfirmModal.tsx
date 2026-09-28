import { triggerAppHaptic } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function LogoutConfirmModal({
  visible,
  onCancel,
  onConfirm,
  loading = false,
}: LogoutConfirmModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      triggerAppHaptic("warning");

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Subtle pulse on the red badge
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={loading ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={loading ? undefined : onCancel}
        />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Top Red Accent Bar */}
          <View style={styles.redTopBar} />

          {/* Red Glowing Icon Container */}
          <View style={styles.iconOuterRing}>
            <Animated.View
              style={[
                styles.iconPulseRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.iconInnerBadge}>
              <Ionicons name="log-out" size={34} color="#DC2626" />
            </View>
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>Log Out</Text>
          <Text style={styles.message}>
            Are you sure you want to log out of CareLink? You will need to sign back
            in to access your account and alerts.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {/* Primary Red Logout Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.logoutButton, loading && styles.disabledButton]}
              onPress={() => {
                triggerAppHaptic("medium");
                onConfirm();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.logoutButtonText}>Yes, Log Out</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.cancelButton}
              onPress={() => {
                triggerAppHaptic("selection");
                onCancel();
              }}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
    overflow: "hidden",
  },
  redTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#DC2626",
  },
  iconOuterRing: {
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconPulseRing: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FEE2E2",
    opacity: 0.7,
  },
  iconInnerBadge: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FEF2F2",
    borderWidth: 2,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 26,
    paddingHorizontal: 6,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  logoutButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#DC2626",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  cancelButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
