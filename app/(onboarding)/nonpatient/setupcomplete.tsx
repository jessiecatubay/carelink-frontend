import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { userOnboarding } from "@/services/auth";
import { Href, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupCompleteScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { updateUser } = useAuth();

  const handlePress = async () => {
    try {
      const response = await userOnboarding(data);
      const updatedUser = response?.data?.data?.user ?? response?.data?.data;

      if (updatedUser) {
        await updateUser(updatedUser);
      }

      router.dismissAll();
      router.replace("/nonpatient/dashboard/(tabs)" as Href);
    } catch (error) {
      console.error("SetupCompleteScreen onboarding failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Progress */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={7} total={8} />
        </View>

        {/* Centered Content */}
        <View style={styles.content}>
          {/* Header Title */}
          <Text style={styles.title}>Setup Complete</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>You{"'"}re all set!</Text>

          {/* Success Circle & Check Icon */}
          <View style={styles.checkCircle}>
            <Image
              source={require("@/assets/icons/check.png")}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </View>

          {/* Congratulations Block */}
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsText}>
            CareLink is now connected{"\n"}and ready.
          </Text>
        </View>

        {/* Action Button */}
        <Button
          title="Go to Dashboard"
          onPress={handlePress}
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
    alignItems: "center",
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
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    marginBottom: 40,
  },
  checkCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F16A66",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  checkIcon: {
    width: 64,
    height: 64,
    tintColor: "#FFFFFF",
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 12,
  },
  congratsText: {
    fontSize: 16,
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    width: "100%",
  },
});
