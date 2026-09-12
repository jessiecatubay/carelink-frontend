import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevicePairingScreen() {
  const router = useRouter();

  return (
    // pls ko improve sa UI
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={4} total={6} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Device Pairing</Text>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>
              Let your non-patient scan you
            </Text>

            <Text style={styles.instructionText}>
              Ask your non-patient to scan your connection QR code using their
              CareLink app to connect their account to yours.
            </Text>
          </View>
        </View>

        <Button
          title="Continue"
          onPress={() =>
            router.push("/(onboarding)/patient/setupcomplete")
          }
          style={styles.button}
        />
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
    paddingHorizontal: 28,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 40,
  },
  instructionCard: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  instructionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#7A7A7A",
    textAlign: "center",
  },
  button: {
    width: "100%",
  },
});