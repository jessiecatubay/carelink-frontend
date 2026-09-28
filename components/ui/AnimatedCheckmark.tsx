import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type AnimatedCheckmarkProps = {
  size?: number;
  circleColor?: string;
  checkColor?: string;
  showRipple?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AnimatedCheckmark({
  size = 160,
  circleColor = "#F16A66",
  checkColor = "#FFFFFF",
  showRipple = true,
  style,
}: AnimatedCheckmarkProps) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0.6)).current;
  const strokeAnim = useRef(new Animated.Value(100)).current;
  const checkBounceAnim = useRef(new Animated.Value(1)).current;

  const pathLength = 100;

  useEffect(() => {
    // 1. Pop circle in
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // 2. Ripple pulse ring
    Animated.parallel([
      Animated.timing(rippleAnim, {
        toValue: 1.35,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Draw checkmark (like drawing with a pen)
    const drawTimer = setTimeout(() => {
      Animated.timing(strokeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start(() => {
        // Trigger haptic feedback on completion
        try {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
        } catch {}

        // Small satisfying bounce
        Animated.sequence([
          Animated.timing(checkBounceAnim, {
            toValue: 1.08,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.spring(checkBounceAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 280);

    return () => clearTimeout(drawTimer);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        size < 100 && { marginBottom: 16 },
        style,
      ]}
    >
      {/* Ripple ring effect */}
      {showRipple ? (
        <Animated.View
          style={[
            styles.rippleRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: circleColor,
              transform: [{ scale: rippleAnim }],
              opacity: rippleOpacity,
            },
          ]}
        />
      ) : null}

      {/* Main Circle & Checkmark SVG */}
      <Animated.View
        style={[
          styles.circleWrapper,
          {
            width: size,
            height: size,
            transform: [
              { scale: scaleAnim },
              { scale: checkBounceAnim },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* Background circle */}
          <Circle cx="50" cy="50" r="48" fill={circleColor} />

          {/* Animated checkmark path drawn from left to right */}
          <AnimatedPath
            d="M 28 52 L 44 68 L 74 34"
            fill="none"
            stroke={checkColor}
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeAnim}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 32,
  },
  rippleRing: {
    position: "absolute",
  },
  circleWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
});
