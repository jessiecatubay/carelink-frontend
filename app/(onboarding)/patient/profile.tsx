import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PatientProfile from "@/components/feature/onboarding/PatientProfile";
import { useOnboarding } from "@/context/OnboardingContext";

export default function PatientProfileScreen() {
  const router = useRouter();
  const { data, setData } = useOnboarding();

  const handleContinue = (profileData: any) => {
    setData((prev) => ({ ...prev, ...profileData }));
    router.push("/(onboarding)/patient/qrcode");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <PatientProfile
        initialValues={{
          age: data.age,
          gender: data.gender,
          medicalConditions: data.medicalConditions,
          notes: data.notes,
        }}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
