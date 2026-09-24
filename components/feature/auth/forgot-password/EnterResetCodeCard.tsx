import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";

type CheckEmailCardProps = {
  email: string;
  onResend?: () => Promise<void> | void;
  onProceedToReset?: () => void;
};

export default function EnterResetCodeCard({
  email,
  onResend,
  onProceedToReset,
}: CheckEmailCardProps) {
  const router = useRouter();
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOpenGmail = async () => {
    try {
      const gmailUrl = "googlegmail://";
      const canOpen = await Linking.canOpenURL(gmailUrl);
      if (canOpen) {
        await Linking.openURL(gmailUrl);
      } else {
        await Linking.openURL("mailto:");
      }
    } catch {
      if (onProceedToReset) {
        onProceedToReset();
      }
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      if (onResend) {
        await onResend();
      }
      setTimer(30);
    } catch (err) {
      console.error("Resend error:", err);
      setTimer(30);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardInstruction}>
          We{"'"}ve sent a verification link to your email. Please check your
          inbox to change your password.
        </Text>

        {/* Readonly Email Box */}
        <View style={styles.emailBox}>
          <Image
            source={require("@/assets/icons/email.png")}
            style={styles.emailIcon}
            resizeMode="contain"
          />
          <View style={styles.inputDivider} />
          <Text style={styles.emailText} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      {/* Open Gmail Button */}
      <Button
        title="Open Gmail"
        onPress={handleOpenGmail}
        style={styles.actionButton}
      />

      {/* Next Step Dev / Fallback Link */}
      {onProceedToReset && (
        <Pressable onPress={onProceedToReset} style={styles.simulateLink}>
          <Text style={styles.simulateText}>
            (Tap here to proceed to Create New Password)
          </Text>
        </Pressable>
      )}

      {/* Resend Link with Countdown */}
      <View style={styles.resendWrap}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend Email (⏱{timer}s)</Text>
        ) : (
          <Pressable onPress={handleResend} disabled={resending}>
            <Text style={styles.resendActiveText}>
              {resending ? "Sending..." : "Resend Email"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Back to Login Link */}
      <Pressable
        onPress={() => router.replace("/login")}
        style={styles.backPressable}
      >
        <Text style={styles.backText}>Back to Login.</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 22,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardInstruction: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  emailBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  emailIcon: {
    width: 20,
    height: 20,
    tintColor: "#9CA3AF",
  },
  inputDivider: {
    width: 1,
    height: 26,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  emailText: {
    flex: 1,
    fontSize: 15,
    color: "#4B5563",
  },
  actionButton: {
    width: "100%",
    marginBottom: 12,
  },
  simulateLink: {
    alignItems: "center",
    marginBottom: 16,
  },
  simulateText: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "underline",
  },
  resendWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  timerText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  resendActiveText: {
    color: "#12A5B5",
    fontSize: 14,
    fontWeight: "600",
  },
  backPressable: {
    alignItems: "center",
    paddingVertical: 6,
  },
  backText: {
    color: "#12A5B5",
    fontSize: 15,
    fontWeight: "500",
  },
});
