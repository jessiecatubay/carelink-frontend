import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen3() {
  const router = useRouter();

  const firstRow = [
    {
      icon: require("@/assets/images/foodlogo.png"),
      label: "Food",
    },
    {
      icon: require("@/assets/images/waterlogo.png"),
      label: "Water",
    },
    {
      icon: require("@/assets/images/assistancelogo.png"),
      label: "Assistance",
    },
  ];

  const secondRow = [
    {
      icon: require("@/assets/images/emergencylogo.png"),
      label: "Emergency",
    },
    {
      icon: require("@/assets/images/satisfiedlogo.png"),
      label: "Satisfied",
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Progress */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={2} total={8} />
        </View>

        {/* Centered Content */}
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>How CareLink Works</Text>
          </View>

          {/* Illustration */}
          <Image
            source={require("@/assets/images/instructionlogo.png")}
            style={styles.hero}
          />

          {/* Instructions */}
          <View style={styles.card}>
            <Text style={styles.bullet}>
              • Receive alerts from patient device
            </Text>
            <Text style={styles.bullet}>
              • Monitor needs in real-time
            </Text>
            <Text style={styles.bullet}>
              • Use AI for guidance
            </Text>
          </View>

          {/* First Row */}
          <View style={styles.row}>
            {firstRow.map((item) => (
              <View key={item.label} style={styles.item}>
                <Image
                  source={item.icon}
                  style={styles.icon}
                />
                <Text style={styles.label}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Second Row */}
          <View style={styles.rowSecond}>
            {secondRow.map((item) => (
              <View key={item.label} style={styles.item}>
                <Image
                  source={item.icon}
                  style={styles.icon}
                />
                <Text style={styles.label}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.caption}>
            Pressing a button sends alerts instantly
          </Text>
        </View>

        <Button
          title="Continue"
          onPress={() => router.push("/(onboarding)/nonpatient/qrcode")}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
  },
  hero: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 5,
  },
  card: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#FFF",
  },
  bullet: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
    lineHeight: 24,
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rowSecond: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 20,
  },
  item: {
    alignItems: "center",
    width: 90,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  label: {
    marginTop: 6,
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
  caption: {
    textAlign: "center",
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
  },
  button: {
    width: "100%",
  },
});