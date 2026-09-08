import DevicePairing from "@/components/feature/onboarding/patient/DevicePairing";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NonpatientDevicePairingScreen() {
  const router = useRouter();

  const handleConnect = (code: string) => {
    console.log("Connecting to patient with code:", code);
    router.push("/(onboarding)/nonpatient/emergencycontact");
  };

  const handleScanQR = () => {
    console.log("Opening QR scanner...");
    handleConnect("MOCK-QR-CODE-123");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <DevicePairing onConnect={handleConnect} onScanQR={handleScanQR} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
