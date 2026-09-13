import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/ui/Button";
import { forgotPasswordSchema } from "@/schema/auth";

type ForgotPasswordFormProps = {
  onSubmit: (email: string) => Promise<void> | void;
  loading?: boolean;
};

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const result = forgotPasswordSchema.safeParse({ email: email.trim() });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Please enter a valid email address.");
      return;
    }

    setError(null);
    await onSubmit(email.trim());
  };

  return (
    <View style={styles.formWrap}>
      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.cardInstruction}>
          Reset your password using your email
        </Text>

        <Text style={styles.fieldLabel}>Email Address</Text>

        <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
          <Image
            source={require("@/assets/icons/email.png")}
            style={styles.emailIcon}
            resizeMode="contain"
          />
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading && (
          <View style={styles.waitingRow}>
            <View style={styles.waitingBadge}>
              <Text style={styles.waitingText}>
                Waiting for verification...
              </Text>
            </View>
            <ActivityIndicator size="small" color="#12A5B5" />
          </View>
        )}
      </View>

      {/* Action Button */}
      <Button
        title="Send Reset Link"
        onPress={handleSubmit}
        loading={loading}
        style={styles.actionButton}
      />

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
  formWrap: {
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
  fieldLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  inputRowError: {
    borderColor: "#F16A66",
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
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    height: "100%",
  },
  errorText: {
    color: "#F16A66",
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
  },
  waitingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    gap: 10,
  },
  waitingBadge: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  waitingText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  actionButton: {
    width: "100%",
    marginBottom: 18,
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
