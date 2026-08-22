import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PatientProfile from "@/components/feature/onboarding/PatientProfile";

export default function PatientProfileScreen() {
  const router = useRouter();

  const handleContinue = (profileData: any) => {
    console.log("Saving patient profile data:", profileData);
    // Navigate to step 5 (vitals/button testing screen)
    router.push("/(onboarding)/patient/device-pairing");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <PatientProfile onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
