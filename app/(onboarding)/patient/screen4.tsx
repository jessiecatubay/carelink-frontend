import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PaginationDots from "@/components/ui/PaginationDots";
import Button from "@/components/ui/Button";

export default function PatientScreen4() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={3} total={6} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Step 4: Device Pairing</Text>
          <Text style={styles.subtitle}>Connect your patient remote control device to the application.</Text>
        </View>
        <View style={styles.buttonWrap}>
          <Button title="Continue" onPress={() => router.push("/(onboarding)/patient/screen5")} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  paginationWrap: { marginTop: 100, alignItems: "center", marginBottom: 40 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "600", color: "#12A5B5", marginBottom: 12 },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center", paddingHorizontal: 20 },
  buttonWrap: { marginBottom: 40 },
});
