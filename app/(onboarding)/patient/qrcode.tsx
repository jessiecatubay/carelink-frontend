import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-qr-code";

export default function DevicePairingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const getGeneratedCode = async () => {
      const response = await axiosInstance.post("/api/user/v1/get-user-by-id", {
        id: user?.id,
      });
      console.log(
        "ofiwjefoaisdofij",
        JSON.stringify(response.data.data, null, 2),
      );

      const codeGenerated = response.data.data.patientProfile.connectionCode;

      if (codeGenerated) {
        setCode(codeGenerated);
        return;
      }

      const result = await axiosInstance.post(
        "/api/patient-profile/v1/generate-connection-code",
        { id: user?.id },
      );
      console.log("user", user);

      setCode(result.data.data.generatedCode);
    };

    getGeneratedCode();
  }, []);

  const qrData = JSON.stringify({
    connectionCode: code,
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={3} total={8} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Device Pairing</Text>

          <View style={styles.qrCard}>
            <QRCode value={qrData} size={250} />
            <Text style={styles.code}>{code}</Text>
          </View>

          <Text style={styles.subtitle}>
            Let your non-patient scan this code
          </Text>
        </View>

        <Button
          title="Continue"
          onPress={() => router.push("/(onboarding)/patient/setupcomplete")}
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
