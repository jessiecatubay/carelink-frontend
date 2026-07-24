import Logo from "@/components/features/auth/Logo";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { Italianno_400Regular, useFonts } from "@expo-google-fonts/italianno";
import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function NonPatientOnboardingScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Italianno-Regular": Italianno_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Pagination */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={0} total={8} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to</Text>

          <View style={styles.logoWrap}>
            <Logo />
          </View>

          <Text style={styles.subtitle}>
            Stay connected and care for{"\n"}
            your loved one anytime.
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonWrap}>
          <Button
            title="Get Started"
            onPress={() =>
              router.push("/(onboarding)/non-patient/terms")
            }
            style={styles.button}
          />
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
    paddingHorizontal: 24,
  },

  paginationWrap: {
    alignItems: "center",
    marginTop: 50,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },

  welcomeText: {
    fontFamily: "Italianno-Regular",
    fontSize: 70,
    color: "#12A7B3",
    textAlign: "center",
    marginBottom: 12,
  },

  logoWrap: {
    marginBottom: 28,
    alignItems: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#666666",
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 20,
  },

  buttonWrap: {
    paddingBottom: 40,
  },

  button: {
    width: "100%",
    height: 55,
    borderRadius: 8,
  },
});