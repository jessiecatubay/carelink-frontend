import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { userOnboarding } from "@/services/auth";
import SetupComplete from "@/components/feature/onboarding/patient/SetupComplete";

export default function SetupCompleteScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { user, updateUser } = useAuth();

  const handleGoToDashboard = async () => {
    try {
      const payload = {
        ...data,
        email: data.email || user?.email || "",
      };
      
      const response = await userOnboarding(payload);
      const updatedUser = response?.data?.data?.user ?? response?.data?.data;

      if (updatedUser) {
        await updateUser(updatedUser);
      } else if (user) {
        // Fallback: update local state if response user is missing
        await updateUser({
          ...user,
          role: "PATIENT",
          onBoarded: true,
        });
      }

      router.dismissAll();
      router.replace("/patient/dashboard" as Href);
    } catch (error) {
      console.error("Patient SetupCompleteScreen onboarding failed", error);
      // Fallback local updates so the user is not trapped in an onboarding redirect loop during dev
      if (user) {
        await updateUser({
          ...user,
          role: "PATIENT",
          onBoarded: true,
        });
      }
      router.dismissAll();
      router.replace("/patient/dashboard" as Href);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <SetupComplete onGoToDashboard={handleGoToDashboard} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
