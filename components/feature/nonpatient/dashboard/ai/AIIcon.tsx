import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

type AIIconProps = {
  size?: number;
  iconColor?: string;
  bgColor?: string;
};

export default function AIIcon({
  size = 46,
  iconColor = "#08A8A8",
  bgColor = "#DFFBFA",
}: AIIconProps) {
  const iconSize = size * 0.65;
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none">
        {/* Antennas / Ears */}
        <Path
          d="M 6 12 C 4 12 3 13.5 3 16 C 3 18.5 4 20 6 20"
          stroke={iconColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <Path
          d="M 26 12 C 28 12 29 13.5 29 16 C 29 18.5 28 20 26 20"
          stroke={iconColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Top Antenna */}
        <Path
          d="M 16 7 V 9"
          stroke={iconColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <Circle cx="16" cy="5.5" r="1.5" fill={iconColor} />
        {/* Head outline */}
        <Rect
          x="6"
          y="9"
          width="20"
          height="16"
          rx="5"
          stroke={iconColor}
          strokeWidth="2.2"
        />
        {/* Eyes */}
        <Rect x="10" y="14" width="3.5" height="3.5" rx="1.75" fill={iconColor} />
        <Rect x="18.5" y="14" width="3.5" height="3.5" rx="1.75" fill={iconColor} />
        {/* Mouth */}
        <Path
          d="M 12 20.5 Q 16 23 20 20.5"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
