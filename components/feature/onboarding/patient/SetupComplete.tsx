import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { Image, StyleSheet, Text, View } from "react-native";

type SetupCompleteProps = {
  onGoToDashboard: () => void;
};

export default function SetupComplete({ onGoToDashboard }: SetupCompleteProps) {
  return (
    <View style={styles.container}>
      <View>
        {/* Progress */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={5} total={6} />
        </View>

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
    marginBottom: 32,
  },
  checkCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F16A66",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  checkIcon: {
    width: 96,
    height: 96,
    tintColor: "#FFFFFF",
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F16A66",
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
