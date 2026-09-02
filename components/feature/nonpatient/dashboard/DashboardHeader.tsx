import { Image, StyleSheet, View } from "react-native";

export default function DashboardHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  logo: {
    height: 58,
    width: 220,
    marginLeft: -25,
  },
});
