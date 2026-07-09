import { useRouter } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import VerificationCard from "@/components/ui/VerificationCard";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const email = "escartinjameboy@gmail.com";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Logo />

        <Text style={styles.title}>Verify your email</Text>

        <Image
          source={require("@/assets/icons/mail.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <VerificationCard email={email} loading />

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Resend email</Text>
          <Text style={styles.changeText} onPress={() => router.back()}>
            Change email
          </Text>
        </View>

        <Button title="Open Gmail" onPress={() => router.push("/(onboarding)/non-patient/screen1")} />
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
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#14A3A5",
    textAlign: "center",
    marginTop: 16,
  },
  heroImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 14,
  },
  linkText: {
    color: "#14A3A5",
    fontWeight: "600",
    fontSize: 15,
  },
  changeText: {
    color: "#F16A66",
    fontWeight: "600",
    fontSize: 15,
  },
});