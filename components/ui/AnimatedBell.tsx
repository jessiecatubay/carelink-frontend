import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";

type AnimatedBellProps = {
  size?: number;
  tintColor?: string;
};

export default function AnimatedBell({
  size = 64,
  tintColor = "#12A5B5",
}: AnimatedBellProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveOpacity = useRef(new Animated.Value(0)).current;
  const waveScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Continuous chime ringing animation sequence with realistic decaying swing
    const ringSequence = Animated.sequence([
      // Slight delay before ring
      Animated.delay(400),

      // Wave expansion & pulse
      Animated.parallel([
        Animated.timing(waveOpacity, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(waveScale, {
          toValue: 1.4,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      // Left-Right pendulum swinging motion
      Animated.sequence([
        Animated.timing(rotationAnim, {
          toValue: 18,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: -18,
          duration: 120,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 14,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: -14,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 8,
          duration: 90,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: -8,
          duration: 90,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 3,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 0,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),

      // Fade out wave
      Animated.timing(waveOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),

      // Reset wave scale
      Animated.timing(waveScale, {
        toValue: 0.8,
        duration: 0,
        useNativeDriver: true,
      }),

      // Rest pause before next ring
      Animated.delay(1200),
    ]);

    const loop = Animated.loop(ringSequence);
    loop.start();

    return () => loop.stop();
  }, []);

  const spin = rotationAnim.interpolate({
    inputRange: [-20, 0, 20],
    outputRange: ["-20deg", "0deg", "20deg"],
  });

  return (
    <View style={[styles.container, { width: size + 28, height: size + 28 }]}>
      {/* Sound wave ripple halo */}
      <Animated.View
        style={[
          styles.waveRing,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            borderColor: tintColor,
            opacity: waveOpacity,
            transform: [{ scale: waveScale }],
          },
        ]}
      />

      {/* Swinging Bell Image */}
      <Animated.View
        style={[
          styles.bellWrapper,
          {
            width: size,
            height: size,
            transform: [
              { translateY: -size / 2 },
              { rotate: spin },
              { translateY: size / 2 },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <Image
          source={require("@/assets/icons/bell.png")}
          style={[styles.bellImage, { width: size, height: size, tintColor }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  waveRing: {
    position: "absolute",
    borderWidth: 2,
    borderStyle: "dashed",
  },
  bellWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  bellImage: {
    width: "100%",
    height: "100%",
  },
});
