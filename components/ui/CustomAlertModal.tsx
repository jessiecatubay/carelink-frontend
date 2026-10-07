import AnimatedCheckmark from "@/components/ui/AnimatedCheckmark";
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

export type AlertModalType =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "confirm"
  | "delete";

export type CustomAlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertModalType;
  /** Primary button label (alias: buttonText) */
  confirmText?: string;
  buttonText?: string;
  /** Primary action callback */
  onConfirm: () => void;
  /** Secondary cancel button label */
  cancelText?: string;
  /** Secondary cancel action callback */
  onCancel?: () => void;
  /** General close action callback for backdrop / Android back */
  onClose?: () => void;
  /** Whether the confirm action is destructive (renders red/coral) */
  isDestructive?: boolean;
  /** Show loading spinner inside the primary button */
  loading?: boolean;
  /** Hide all buttons (for auto-redirecting alerts) */
  hideButton?: boolean;
  /** Automatically dismiss/confirm after N milliseconds */
  autoDismissMs?: number;
  /** Custom children below the message if needed */
  children?: React.ReactNode;
};

export default function CustomAlertModal({
  visible,
  title,
  message,
  type = "info",
  confirmText,
  buttonText = "Continue",
  onConfirm,
  cancelText,
  onCancel,
  onClose,
  isDestructive = false,
  loading = false,
  hideButton = false,
  autoDismissMs,
  children,
}: CustomAlertModalProps) {
  const resolvedConfirmText = confirmText || buttonText;
  const hasCancel = Boolean(cancelText && onCancel);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          iconName: "checkmark-circle" as const,
          iconColor: "#0AA7A8",
          bgColor: "#EAF9F9",
          borderColor: "#B2EBF2",
          buttonColor: "#0AA7A8",
        };
      case "warning":
        return {
          iconName: "alert-circle" as const,
          iconColor: "#F59E0B",
          bgColor: "#FEF3C7",
          borderColor: "#FDE68A",
          buttonColor: "#F59E0B",
        };
      case "error":
      case "delete":
        return {
          iconName: type === "delete" ? ("trash-outline" as const) : ("close-circle" as const),
          iconColor: "#EF4444",
          bgColor: "#FEE2E2",
          borderColor: "#FECDD3",
          buttonColor: "#EF4444",
        };
      case "confirm":
        return {
          iconName: isDestructive ? ("alert-circle-outline" as const) : ("help-circle-outline" as const),
          iconColor: isDestructive ? "#EF4444" : "#0AA7A8",
          bgColor: isDestructive ? "#FFF1F2" : "#EAF9F9",
          borderColor: isDestructive ? "#FECDD3" : "#B2EBF2",
          buttonColor: isDestructive ? "#EF4444" : "#0AA7A8",
        };
      case "info":
      default:
        return {
          iconName: "information-circle" as const,
          iconColor: "#0284C7",
          bgColor: "#E0F2FE",
          borderColor: "#BAE6FD",
          buttonColor: "#0284C7",
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
        tension: 70,
        friction: 6,
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
      onRequestClose={onClose || onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose || onCancel || onConfirm}
        />

        <View style={styles.card}>
          {/* Badge Icon */}
          {type === "success" ? (
            <AnimatedCheckmark
              size={72}
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
                  borderColor: config.borderColor,
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <Ionicons
                name={config.iconName}
                size={42}
                color={config.iconColor}
              />
            </Animated.View>
          )}

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Optional Children */}
          {children}

          {/* Action Buttons */}
          {!hideButton && (
            <View
              style={[
                styles.buttonsContainer,
                hasCancel ? styles.buttonsRow : styles.buttonsColumn,
              ]}
            >
              {hasCancel && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.cancelButton}
                  onPress={onCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.confirmButton,
                  hasCancel && styles.confirmButtonFlex,
                  { backgroundColor: isDestructive ? "#EF4444" : config.buttonColor },
                  loading && styles.buttonDisabled,
                ]}
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {resolvedConfirmText}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {hideButton && (
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
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 99999,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 16,
  },

  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
  },

  animatedCheckWrap: {
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
    textAlign: "center",
    marginBottom: 22,
    paddingHorizontal: 6,
  },

  buttonsContainer: {
    width: "100%",
  },

  buttonsColumn: {
    width: "100%",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "600",
  },

  confirmButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  confirmButtonFlex: {
    flex: 1.3,
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  redirectText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 6,
  },
});
