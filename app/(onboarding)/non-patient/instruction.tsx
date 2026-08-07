import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

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
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map((item) => (
          <View
            key={item}
            style={[
              styles.dot,
              item < 3 && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Title */}
      <Text style={styles.title}>
        How <Text style={styles.brand}>CareLink</Text> Works
      </Text>

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

      <View style={{ flex: 1 }} />

      <Button
        title="Continue"
        onPress={() => router.push("./qrcode")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 30,
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#12A5B5",
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "700",
    color: "#16A7B8",
    marginBottom: 20,
  },

  brand: {
    color: "#F56C8B",
    fontStyle: "italic",
  },

  hero: {
    width: 500,
    height: 170,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  bullet: {
    fontSize: 17,
    color: "#555",
    lineHeight: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },

  rowSecond: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 50,
    marginBottom: 18,
  },

  item: {
    alignItems: "center",
    width: 90,
  },

  icon: {
    width: 500,
    height: 50,
    resizeMode: "contain",
  },

  label: {
    marginTop: 8,
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },

  caption: {
    textAlign: "center",
    fontSize: 15,
    color: "#777",
    marginTop: 10,
  },
});