import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Screen4() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progress}>
        {[...Array(7)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < 4 && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Title */}
      <Text style={styles.title}>Device Pairing</Text>

      {/* QR Card */}
      <View style={styles.qrCard}>
        <Image
          source={require("@/assets/icons/qr-code.png")}
          style={styles.qrImage}
        />

        <Text style={styles.code}>X12345</Text>
      </View>

      {/* Description */}
      <Text style={styles.subtitle}>
        Connect your device
      </Text>

      <View style={{ flex: 1 }} />

      <Button
        title="Continue"
        onPress={() => router.push("/non-patient/screen5")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 30,
  },

  /* Progress */
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D8D8D8",
    marginHorizontal: 6,
  },

  activeDot: {
    backgroundColor: "#10A8BA",
  },

  /* Title */
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: "#10A8BA",
    textAlign: "center",
    marginBottom: 40,
  },

  /* QR Card */
  qrCard: {
    alignSelf: "center",
    width: 255,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4D4D4D",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 28,
  },

  qrImage: {
    width: 185,
    height: 185,
    resizeMode: "contain",
  },

  code: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: "700",
    color: "#111111",
    letterSpacing: 0.5,
  },

  subtitle: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 17,
    color: "#7A7A7A",
  },
});