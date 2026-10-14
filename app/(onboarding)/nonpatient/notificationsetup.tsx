import AnimatedBell from "@/components/ui/AnimatedBell";
import Button from "@/components/ui/Button";
import NoteBox from "@/components/ui/NoteBox";
import PaginationDots from "@/components/ui/PaginationDots";
import { registerForPushNotificationsAsync } from "@/hooks/lib/notifications";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationSetupScreen() {
  const router = useRouter();

  const handleEnable = async () => {
    try {
      await registerForPushNotificationsAsync();
    } catch (e) {
      console.log("Push notification registration during onboarding:", e);
    }
    // Navigate to setup complete
    router.push("/(onboarding)/nonpatient/setupcomplete");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View>
          {/* Progress */}
          <View style={styles.paginationWrap}>
            <PaginationDots currentIndex={7} total={8} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Notifications Setup</Text>

          {/* Description */}
          <Text style={styles.subtitle}>
            Never miss a critical moment.
          </Text>

          {/* Card */}
          <View style={styles.card}>
            <AnimatedBell size={64} tintColor="#12A5B5" />

            <Text style={styles.cardTitle}>Stay Alerted</Text>

            <Text style={styles.cardText}>
              Get notified instantly when the patient needs help
            </Text>
          </View>

          {/* Note */}
          <NoteBox
            text="Enabling notifications ensures you receive real-time alerts and urgent patient requests immediately, even when the app is in the background."
            style={{ marginTop: 18 }}
          />
        </View>

        {/* Action Button */}
        <View style={styles.buttonWrap}>
          <Button
            title="Enable Notifications"
            onPress={handleEnable}
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
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#FFFFFF",
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  bellIcon: {
    width: 60,
    height: 60,
    marginBottom: 16,
    tintColor: "#12A5B5",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F16A66",
    textAlign: "center",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
