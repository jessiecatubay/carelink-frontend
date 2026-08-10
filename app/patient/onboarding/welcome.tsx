import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "@/components/common/Logo";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={0} total={6} />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Logo />
          <Text style={styles.subtitle}>
            Stay connected and send requests{"\n"}to your caregivers anytime.
          </Text>
        </View>

        <View style={styles.buttonWrap}>
          <Button
            title="Get Started"
            onPress={() => router.push("/patient/onboarding/terms")}
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
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  paginationWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 54,
    color: "#14A3A5",
    fontFamily: "Italianno-Regular",
    textAlign: "center",
    marginBottom: -10, // Pulls the logo closer to "Welcome to" like the mockup
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