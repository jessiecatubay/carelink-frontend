import DevicePairing from "@/components/feature/onboarding/patient/DevicePairing";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NonpatientDevicePairingScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/(onboarding)/nonpatient/emergencycontact");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <DevicePairing onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});