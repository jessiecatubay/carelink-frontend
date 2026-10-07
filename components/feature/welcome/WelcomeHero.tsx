import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeHero() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/welcomepagepic.png")}
        style={styles.heroImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height > 750 ? 10 : 4,
  },
  heroImage: {
    width: Math.min(width * 0.88, 330),
    height: height > 750 ? Math.min(height * 0.32, 255) : 205,
  },
});
