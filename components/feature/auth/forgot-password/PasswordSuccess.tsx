import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";

type PasswordSuccessProps = {
  onBackToLogin?: () => void;
};

export default function PasswordSuccess({ onBackToLogin }: PasswordSuccessProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkCircle}>
        <Image
          source={require("@/assets/icons/check.png")}
          style={styles.checkIcon}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Congratulations!</Text>

      <Text style={styles.subtitle}>
        Your password has been{"\n"}successfully changed
      </Text>

      <Button
        title="Back to Login"
        onPress={handleBack}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
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
    width: 80,
    height: 80,
    tintColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 36,
  },
  button: {
    width: "100%",
  },
});
