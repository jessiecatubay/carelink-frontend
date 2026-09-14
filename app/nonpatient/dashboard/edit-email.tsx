import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditEmailScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [email, setEmail] = useState(user?.email || "zaynmalik@gmail.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/nonpatient/dashboard/profile");
    }
  };

  const handleSave = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      if (user) {
        await updateUser({
          ...user,
          email: trimmedEmail,
        });
      }

      Alert.alert("Success", "Your email address has been updated.", [
        {
          text: "OK",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/nonpatient/dashboard/profile");
            }
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to update email:", err);
      Alert.alert("Error", "Failed to update email address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      {/* Decorative subtle curved background element */}
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>Edit Email</Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Update Your Email</Text>
          <Text style={styles.subtitle}>
            Please enter your new email address. This will be used for signing in and account notifications.
          </Text>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <Input
                placeholder="Email Address"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) {
                    setError(undefined);
                  }
                }}
                error={error}
              />
            </View>
          </View>

          {/* Info note */}
          <View style={styles.noteBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#0AA7A8"
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              A valid email ensures you receive important security alerts, health reports, and system notifications.
            </Text>
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Save Changes"
              loading={loading}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  backgroundAccent: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 220,
    borderRadius: 130,
    backgroundColor: "#EDFBFB",
    opacity: 0.9,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E242B",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#707477",
    lineHeight: 20,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E242B",
    marginBottom: 8,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FAFA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C5ECEE",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 28,
    gap: 10,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#0AA7A8",
    height: 52,
    borderRadius: 14,
  },
});
