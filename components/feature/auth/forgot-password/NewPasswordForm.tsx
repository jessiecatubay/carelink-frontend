import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "@/components/ui/Button";
import { resetPasswordSchema } from "@/schema/auth";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        {/* New Password Input */}
        <View
          style={[
            styles.inputRow,
            error && !password ? styles.inputRowError : null,
          ]}
        >
          <Image
            source={require("@/assets/icons/padlock.png")}
            style={styles.padlockIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.textInput}
            placeholder="New Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={10}
          >
            <Image
              source={
                showPassword
                  ? require("@/assets/icons/view.png")
                  : require("@/assets/icons/hide.png")
              }
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Confirm Password Input */}
        <View
          style={[
            styles.inputRow,
            error && (!confirmPassword || password !== confirmPassword)
              ? styles.inputRowError
              : null,
          ]}
        >
          <Image
            source={require("@/assets/icons/padlock.png")}
            style={styles.padlockIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) setError(null);
            }}
          />
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            hitSlop={10}
          >
            <Image
              source={
                showConfirmPassword
                  ? require("@/assets/icons/view.png")
                  : require("@/assets/icons/hide.png")
              }
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  padlockIcon: {
    width: 20,
    height: 20,
    tintColor: "#9CA3AF",
    marginRight: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#9CA3AF",
    marginLeft: 10,
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
    marginTop: -4,
    marginLeft: 4,
  },
  actionButton: {
    width: "100%",
  },
});
