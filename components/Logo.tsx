import { Image, StyleSheet } from "react-native";

export default function Logo() {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 320,
    height: 160,
    alignSelf: "center",
    marginBottom: 32,
  },
});