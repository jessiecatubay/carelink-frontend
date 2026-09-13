import Svg, { Path, Rect } from "react-native-svg";

type ScanIconProps = {
  size?: number;
  color?: string;
};

export default function ScanIcon({
  size = 24,
  color = "#12A5B5",
}: ScanIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top Left Bracket */}
      <Path
        d="M 4 9.5 V 6 A 2 2 0 0 1 6 4 H 9.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top Right Bracket */}
      <Path
        d="M 14.5 4 H 18 A 2 2 0 0 1 20 6 V 9.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Left Bracket */}
      <Path
        d="M 4 14.5 V 18 A 2 2 0 0 0 6 20 H 9.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Right Bracket */}
      <Path
        d="M 14.5 20 H 18 A 2 2 0 0 0 20 18 V 14.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Horizontal Scan Line */}
      <Path
        d="M 5 12 H 19"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Center Block */}
      <Rect
        x="8"
        y="8"
        width="8"
        height="8"
        rx="2"
        fill={color}
      />
    </Svg>
  );
}
