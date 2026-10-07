import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { resetPasswordSchema } from "@/schema/auth";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type NewPasswordFormProps = {
  onSubmit: (password: string) => Promise<void> | void;
  loading?: boolean;
};

export default function NewPasswordForm({
  onSubmit,
  loading = false,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const result = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Passwords do not match.");
      return;
    }

    setError(null);
    await onSubmit(password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <PasswordInput
          placeholder="New Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError(null);
          }}
          error={error && !password ? error : undefined}
        />

        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (error) setError(null);
          }}
          error={
            error && (!confirmPassword || password !== confirmPassword)
              ? error
              : undefined
          }
        />

        {error && password && confirmPassword && password === confirmPassword ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>

      <Button
        title="Reset Password"
        onPress={handleSubmit}
        loading={loading}
        style={styles.actionButton}
      />
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
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  errorText: {
    color: "#F16A66",
    fontSize: 13,
    marginTop: -4,
    marginLeft: 4,
  },
  actionButton: {
    width: "100%",
  },
});
