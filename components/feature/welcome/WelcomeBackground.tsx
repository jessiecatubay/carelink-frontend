import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function WelcomeBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg
        width={width}
        height={110}
        viewBox={`0 0 ${width} 110`}
        fill="none"
      >
        {/* Bottom Left Mint Wave */}
        <Path
          d={`M 0,40 Q ${width * 0.2},10 ${width * 0.45},60 Q ${width * 0.55},80 ${width * 0.6},110 L 0,110 Z`}
          fill="#CEEFE6"
          opacity={0.85}
        />
        {/* Bottom Right Coral/Peach Wave */}
        <Path
          d={`M ${width * 0.4},110 Q ${width * 0.65},55 ${width * 0.85},70 Q ${width * 0.95},80 ${width},60 L ${width},110 Z`}
          fill="#FDE4E1"
          opacity={0.85}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
});
