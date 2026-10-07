import CustomAlertModal from "@/components/ui/CustomAlertModal";
import { triggerAppHaptic } from "@/context/HapticsContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SlideToCall911Props = {
  phoneNumber?: string;
  label?: string;
  onCallSuccess?: () => void;
};

export default function SlideToCall911({
  phoneNumber = "911",
  label = "Slide right to call 911",
  onCallSuccess,
}: SlideToCall911Props) {
  const windowWidth = Dimensions.get("window").width;
  const [containerWidth, setContainerWidth] = useState(windowWidth - 48);
  const [alertVisible, setAlertVisible] = useState(false);
  const THUMB_SIZE = 52;
  const maxDrag = Math.max(10, containerWidth - THUMB_SIZE - 8);

  const translateX = useRef(new Animated.Value(0)).current;
  const isDragging = useRef(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const thumbScaleAnim = useRef(new Animated.Value(1)).current;

  // Pulsating emergency glow and guiding arrow animation
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    const arrowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: 6,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseLoop.start();
    arrowLoop.start();

    return () => {
      pulseLoop.stop();
      arrowLoop.stop();
    };
  }, []);

  const triggerCall = () => {
    triggerAppHaptic("warning");

    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      setAlertVisible(true);
    });

    onCallSuccess?.();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 2,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        Math.abs(gestureState.dx) > 2,
      onPanResponderGrant: () => {
        isDragging.current = true;
        triggerAppHaptic("medium");
        Animated.spring(thumbScaleAnim, {
          toValue: 1.08,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        // Sliding to the right means dx is positive
        if (gestureState.dx > 0) {
          const clamped = Math.min(maxDrag, gestureState.dx);
          translateX.setValue(clamped);
        } else {
          translateX.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        Animated.spring(thumbScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        // If dragged more than 55% to the right
        if (gestureState.dx >= maxDrag * 0.55) {
          // Snap all the way to the right
          Animated.timing(translateX, {
            toValue: maxDrag,
            duration: 120,
            useNativeDriver: true,
          }).start(() => {
            triggerCall();
            // Spring back to starting position on the left
            setTimeout(() => {
              Animated.spring(translateX, {
                toValue: 0,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
              }).start();
            }, 600);
          });
        } else {
          // Spring back to start
          Animated.spring(translateX, {
            toValue: 0,
            friction: 7,
            tension: 45,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        Animated.spring(thumbScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  // Fade out label as slider moves to the right
  const textOpacity = translateX.interpolate({
    inputRange: [0, maxDrag * 0.6],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      {/* 911 Emergency Header Badge */}
      <View style={styles.emergencyBanner}>
        <View style={styles.badgeLeft}>
          <View style={styles.blinkingDot} />
          <Text style={styles.emergencyBadgeTitle}>EMERGENCY DISPATCH</Text>
        </View>
        <Text style={styles.emergencyNumberText}>911</Text>
      </View>

      {/* Slide Track */}
      <View
        style={styles.track}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          if (width > 0 && Math.abs(width - containerWidth) > 2) {
            setContainerWidth(width);
          }
        }}
      >
        {/* Track Content: Text & Rightward Arrow Animation */}
        <Animated.View
          pointerEvents="none"
          style={[styles.trackTextContainer, { opacity: textOpacity }]}
        >
          <Text style={styles.trackLabel}>{label}</Text>

          <Animated.View
            style={[
              styles.arrowsRow,
              { transform: [{ translateX: arrowAnim }] },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.7)"
            />
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        {/* Sliding Thumb (Phone Icon on the LEFT, slides RIGHT) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            {
              transform: [{ translateX }, { scale: thumbScaleAnim }],
            },
          ]}
        >
          <View style={styles.thumbInner}>
            <Ionicons name="call" size={24} color="#EF4444" />
          </View>
        </Animated.View>
      </View>

      <CustomAlertModal
        visible={alertVisible}
        type="error"
        title="Emergency Call"
        message={`Unable to place call to ${phoneNumber}. Please dial manually on your device.`}
        confirmText="OK"
        onConfirm={() => setAlertVisible(false)}
        onClose={() => setAlertVisible(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    padding: 14,
    marginBottom: 20,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  emergencyBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  badgeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  blinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  emergencyBadgeTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#DC2626",
    letterSpacing: 0.6,
  },
  emergencyNumberText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#EF4444",
    letterSpacing: 1,
  },
  track: {
    height: 60,
    backgroundColor: "#EF4444",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
    position: "relative",
    overflow: "hidden",
  },
  trackTextContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 60,
    gap: 8,
  },
  arrowsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 2,
  },
  trackLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  thumbInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
});
