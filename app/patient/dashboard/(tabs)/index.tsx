import PatientRemote from "@/components/feature/patient/dashboard/PatientRemote";
import LogoutButton from "@/components/ui/LogoutButton";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientDashboardHome() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Interactive Remote Control */}
        <View style={styles.content}>
          <PatientRemote />
        </View>

        {/* Bottom Sign Out */}
        <View style={styles.footer}>
          <LogoutButton />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 500,
    height: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footer: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
});
