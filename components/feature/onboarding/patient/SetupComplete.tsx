import { Image, StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

type SetupCompleteProps = {
  onGoToDashboard: () => void;
};

export default function SetupComplete({ onGoToDashboard }: SetupCompleteProps) {
  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.paginationWrap}>
        <PaginationDots currentIndex={5} total={6} />
      </View>

      {/* Centered Content */}
      <View style={styles.content}>
        {/* Header Title */}
        <Text style={styles.title}>Setup Complete</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>You're all set!</Text>

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
      <View style={styles.buttonWrap}>
        <Button
          title="Go to Dashboard"
          onPress={onGoToDashboard}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    // Soft shadow
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
  buttonWrap: {
    marginBottom: 40,
    width: "100%",
  },
  button: {
    width: "100%",
  },
});
