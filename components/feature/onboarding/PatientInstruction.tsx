import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { Image, StyleSheet, Text, View } from "react-native";

type PatientInstructionProps = {
  onContinue: () => void;
};

export default function PatientInstruction({ onContinue }: PatientInstructionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.paginationWrap}>
        <PaginationDots currentIndex={2} total={6} />
      </View>

      {/* CareLink Works Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CareLink Works</Text>
      </View>

      {/* Grid of Alert Buttons */}
      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.row}>
          <View style={[styles.card, styles.foodCard]}>
            <Image
              source={require("@/assets/icons/food.png")}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>Food</Text>
          </View>

          <View style={[styles.card, styles.waterCard]}>
            <Image
              source={require("@/assets/icons/water.png")}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>Water</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={[styles.card, styles.assistanceCard]}>
            <Image
              source={require("@/assets/icons/assistance.png")}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>Assistance</Text>
          </View>

          <View style={[styles.card, styles.emergencyCard]}>
            <Image
              source={require("@/assets/icons/emergency.png")}
              style={[styles.cardIcon, styles.whiteIcon]}
              resizeMode="contain"
            />
            <Text style={[styles.cardText, styles.whiteText]}>Emergency</Text>
          </View>
        </View>

        {/* Row 3 - Centered */}
        <View style={styles.rowCentered}>
          <View style={[styles.card, styles.satisfiedCard]}>
            <Image
              source={require("@/assets/icons/satisfied.png")}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>Satisfied</Text>
          </View>
        </View>
      </View>

      {/* Helper Instruction Text */}
      <Text style={styles.helperText}>
        Pressing a button sends alerts instantly
      </Text>

      {/* Bottom Button */}
      <View style={styles.buttonWrap}>
        <Button
          title="Continue"
          onPress={onContinue}
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
    backgroundColor: "#FFFFFF",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  rowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: 110,
    height: 110,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    // Soft blur drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  foodCard: {
    backgroundColor: "#FCECE9", // light orange/peach
  },
  waterCard: {
    backgroundColor: "#D4EBFD", // light blue
  },
  assistanceCard: {
    backgroundColor: "#FDE8C7", // light yellow
  },
  emergencyCard: {
    backgroundColor: "#F16A66", // solid red/coral
  },
  satisfiedCard: {
    backgroundColor: "#D3F4DF", // light green
  },
  cardIcon: {
    width: 44,
    height: 44,
    marginBottom: 6,
  },
  whiteIcon: {
    tintColor: "#FFFFFF",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151", // dark gray/black
  },
  whiteText: {
    color: "#FFFFFF",
  },
  helperText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    marginVertical: 20,
  },
  buttonWrap: {
    marginBottom: 40,
    width: "100%",
  },
  button: {
    width: "100%",
  },
});
