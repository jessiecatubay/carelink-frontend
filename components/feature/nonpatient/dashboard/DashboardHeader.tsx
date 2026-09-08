import { Image, StyleSheet, View } from "react-native";
import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Pressable
            onPress={() => router.push("/nonpatient/dashboard/scan-patient")}
            style={{
              marginRight: 15,
            }}
          >
            <Ionicons name="qr-code-outline" size={25} color="#000" />
          </Pressable>
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
