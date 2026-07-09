import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

export default function NonPatientOnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={0} total={8} />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Logo />
          <Text style={styles.subtitle}>
            Stay connected and care for{"\n"}your loved one anytime.
          </Text>
        </View>

        <View style={styles.buttonWrap}>
          <Button
            title="Get Started"
            onPress={() => router.push("/(onboarding)/non-patient/screen2")}
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
    justifyContent: "space-between",
  },
  paginationWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 48,
    color: "#14A3A5",
    marginBottom: 24,
    fontFamily: "GreatVibes-Regular",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginTop: 24,
    lineHeight: 24,
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});