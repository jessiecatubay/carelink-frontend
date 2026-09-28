import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type AlertModalType = "success" | "info" | "warning" | "error";

export type CustomAlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  hideButton?: boolean;
  autoDismissMs?: number;
  type?: AlertModalType;
  onConfirm: () => void;
};

export default function CustomAlertModal({
  visible,
  title,
  message,
  buttonText = "Continue",
  hideButton = false,
  autoDismissMs,
  type = "success",
  onConfirm,
}: CustomAlertModalProps) {
  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          iconName: "checkmark-circle" as const,
          iconColor: "#0AA7A8",
          bgColor: "#EAF9F9",
          buttonColor: "#0AA7A8",
        };
      case "warning":
        return {
          iconName: "alert-circle" as const,
          iconColor: "#F59E0B",
          bgColor: "#FEF3C7",
          buttonColor: "#F59E0B",
        };
      case "error":
        return {
          iconName: "close-circle" as const,
          iconColor: "#EF4444",
          bgColor: "#FEE2E2",
          buttonColor: "#EF4444",
        };
      case "info":
      default:
        return {
          iconName: "information-circle" as const,
          iconColor: "#3B82F6",
          bgColor: "#EFF6FF",
          buttonColor: "#3B82F6",
        };
    }
  };

  const config = getIconConfig();
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      iconScale.setValue(0);
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 60,
        friction: 5,
        useNativeDriver: true,
      }).start();

      if (autoDismissMs && autoDismissMs > 0) {
        const timer = setTimeout(() => {
          onConfirm();
        }, autoDismissMs);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, autoDismissMs, onConfirm]);

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
          {/* Badge Icon: AnimatedCheckmark for success, spring badge for others */}
          {type === "success" ? (
            <AnimatedCheckmark
              size={76}
              circleColor={config.iconColor}
              checkColor="#FFFFFF"
              showRipple
              style={styles.animatedCheckWrap}
            />
          ) : (
            <Animated.View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: config.bgColor,
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <Ionicons
                name={config.iconName}
                size={48}
                color={config.iconColor}
              />
            </Animated.View>
          )}

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Button or Auto-Redirect Note */}
          {!hideButton && buttonText ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.button,
                { backgroundColor: config.buttonColor },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.redirectText}>Redirecting to dashboard...</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  iconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  animatedCheckWrap: {
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  redirectText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 6,
  },
});
