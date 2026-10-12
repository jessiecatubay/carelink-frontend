import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";

export default function Logo({ style }: { style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={[styles.logo, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "82%",
    maxWidth: 320,
    height: 60,
    alignSelf: "center",
    marginBottom: 24,
  },
});