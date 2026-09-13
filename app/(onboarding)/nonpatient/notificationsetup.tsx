import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

export default function NotificationSetupScreen() {
  const router = useRouter();

  const handleEnable = () => {
    // Navigate to setup complete
    router.push("/(onboarding)/nonpatient/setupcomplete");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View>
          {/* Progress */}
          <View style={styles.paginationWrap}>
            <PaginationDots currentIndex={5} total={7} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Notifications Setup</Text>

          {/* Description */}
          <Text style={styles.subtitle}>
            Never miss a critical moment.
          </Text>

          {/* Card */}
          <View style={styles.card}>
            <Image
              source={require("@/assets/icons/bell.png")}
              style={styles.bellIcon}
              resizeMode="contain"
            />

            <Text style={styles.cardTitle}>Stay Alerted</Text>

            <Text style={styles.cardText}>
              Get notified instantly when the patient needs help
            </Text>
          </View>

          {/* Note */}
          <View style={styles.noteBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#12A5B5"
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Note: </Text>
              Enabling notifications ensures you receive real-time alerts and urgent patient requests immediately, even when the app is in the background.
            </Text>
          </View>
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
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FAFA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C5ECEE",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 18,
    gap: 10,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  noteBold: {
    fontWeight: "700",
    color: "#12A5B5",
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
