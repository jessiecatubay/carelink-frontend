import { Image, Pressable, StyleSheet } from "react-native";

type RoleSelectorDotProps = {
  selected: boolean;
  color: "blue" | "pink";
  onPress?: () => void;
};

export default function RoleSelectorDot({
  selected,
  color,
  onPress,
}: RoleSelectorDotProps) {
  const imageSource = !selected
    ? require("@/assets/icons/selectrole.png")
    : color === "blue"
    ? require("@/assets/icons/patientrole.png")
    : require("@/assets/icons/nonpatientrole.png");

  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Image source={imageSource} style={styles.dot} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});