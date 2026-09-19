import PatientRemote from "@/components/feature/patient/dashboard/PatientRemote";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientDashboardHome() {
  const router = useRouter();

  const handleOpenSettings = () => {
    router.push("/patient/dashboard/settings");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header with Centered Large Logo and Settings Icon on Upper Right */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={12}
            onPress={handleOpenSettings}
            style={styles.settingsButton}
          >
            <Image
              source={require("@/assets/icons/settings.png")}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Interactive Remote Control */}
        <View style={styles.content}>
          <PatientRemote />
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
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    minHeight: 85,
    position: "relative",
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FDFA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
    zIndex: 10,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: "#0AA7A8",
  },
  logo: {
    width: 280,
    height: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
