import DevicePairing from "@/components/feature/onboarding/patient/DevicePairing";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevicePairingScreen() {
  const router = useRouter();

  const handleConnect = (code: string) => {
    console.log("Connecting to device with code:", code);
    // On success, navigate to the setup completion page (screen6)
    router.push("/(onboarding)/patient/setupcomplete");
  };

  const handleScanQR = () => {
    console.log("Opening QR scanner...");
    // For now, mockup a successful scan by connecting
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
