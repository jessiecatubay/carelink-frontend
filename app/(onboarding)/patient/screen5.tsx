import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PaginationDots from "@/components/ui/PaginationDots";
import Button from "@/components/ui/Button";

export default function PatientScreen5() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={4} total={6} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Step 5: Alert Test</Text>
          <Text style={styles.subtitle}>Test your remote control button to verify connection.</Text>
        </View>
        <View style={styles.buttonWrap}>
          <Button title="Continue" onPress={() => router.push("/(onboarding)/patient/screen6")} />
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
