import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>Better Health. Closer Together.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: height > 750 ? 16 : 8,
    marginBottom: height > 750 ? 10 : 6,
  },
  logo: {
    width: 700,
    height: 100,
  },
  tagline: {
    fontSize: 15.5,
    color: "#374151",
    fontWeight: "500",
    marginTop: 6,
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
