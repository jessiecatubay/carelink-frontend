import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type GoogleLoadingModalProps = {
  visible: boolean;
  status?: string;
  subtext?: string;
};

export default function GoogleLoadingModal({
  visible,
  status = "Signing in with Google...",
  subtext = "Please wait while we verify your account...",
}: GoogleLoadingModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(0.88);
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
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Top Brand Gradient Strip */}
          <View style={styles.topBrandBar} />

          {/* Glowing Google Badge */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.googleIconBadge}>
              <Image
                source={require("@/assets/icons/google.png")}
                style={styles.googleIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Status & Subtitle */}
          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.subtext}>{subtext}</Text>

          {/* Activity Loader */}
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color="#0AA7A8" />
            <Text style={styles.connectingText}>Connecting to CareLink...</Text>
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
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    overflow: "hidden",
  },
  topBrandBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#0AA7A8",
  },
  iconContainer: {
    width: 76,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  pulseRing: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E0F2FE",
    opacity: 0.7,
  },
  googleIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  googleIcon: {
    width: 32,
    height: 32,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  connectingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0AA7A8",
  },
});
