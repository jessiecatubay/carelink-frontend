import { Image, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import ScanIcon from "@/components/common/ScanIcon";

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
        style={styles.scanButton}
        hitSlop={8}
      >
        <ScanIcon size={24} color="#12A5B5" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  logo: {
    height: 58,
    width: 200,
    marginLeft: -20,
  },
  scanButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0FCFD",
    borderWidth: 1,
    borderColor: "#D4F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
});
