import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PatientInstruction from "@/components/feature/onboarding/PatientInstruction";

export default function PatientInstructionScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to next screen in patient onboarding flow, typically screen4 (which might be setup or other info)
    router.push("/(onboarding)/patient/profile");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <PatientInstruction onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
