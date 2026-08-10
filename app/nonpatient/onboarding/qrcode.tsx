import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen4() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Progress */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={3} total={8} />
        </View>

        {/* Centered Content */}
        <View style={styles.content}>
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
        </View>

        <Button
          title="Continue"
          onPress={() => router.push("/nonpatient/onboarding/emergencycontact")}
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
    marginBottom: 40,
  },
  qrCard: {
    alignSelf: "center",
    width: 280,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 32,
  },
  qrImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  code: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
  },
  button: {
    width: "100%",
  },
});