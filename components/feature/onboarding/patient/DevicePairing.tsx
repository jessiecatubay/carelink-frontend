import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";

type DevicePairingProps = {
  onContinue: () => void;
};

export default function DevicePairing({
  onContinue,
}: DevicePairingProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.paginationWrap}>
            <PaginationDots currentIndex={3} total={7} />
          </View>

          <Text style={styles.title}>Connect to a Patient</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Scan the Patient's QR Code
            </Text>

            <Text style={styles.description}>
              To connect your account to a patient, ask the patient to open
              their CareLink QR code.
            </Text>

            <View style={styles.instructions}>
              <View style={styles.instructionRow}>
                <View style={styles.numberCircle}>
                  <Text style={styles.number}>1</Text>
                </View>

                <View style={styles.instructionContent}>
                  <Text style={styles.instructionTitle}>
                    Ask the patient to open their QR code
                  </Text>

                  <Text style={styles.instructionText}>
                    The patient can display their QR code from their CareLink
                    account.
                  </Text>
                </View>
              </View>

              <View style={styles.instructionRow}>
                <View style={styles.numberCircle}>
                  <Text style={styles.number}>2</Text>
                </View>

                <View style={styles.instructionContent}>
                  <Text style={styles.instructionTitle}>
                    Keep the QR code ready
                  </Text>

                  <Text style={styles.instructionText}>
                    Make sure the patient's QR code is visible when you are
                    ready to connect.
                  </Text>
                </View>
              </View>

              <View style={styles.instructionRow}>
                <View style={styles.numberCircle}>
                  <Text style={styles.number}>3</Text>
                </View>

                <View style={styles.instructionContent}>
                  <Text style={styles.instructionTitle}>
                    Scan from your dashboard
                  </Text>

                  <Text style={styles.instructionText}>
                    After completing setup, you can scan the patient's QR code
                    from the scanner in your dashboard.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <Button
            title="Continue"
            onPress={onContinue}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
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
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#FFFFFF",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
  },
  instructions: {
    gap: 24,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#12A5B5",
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});