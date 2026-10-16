import CustomAlertModal, { AlertModalType } from "@/components/ui/CustomAlertModal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import NoteBox from "@/components/ui/NoteBox";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import KeyboardAwareScrollView from "@/components/common/KeyboardAwareScrollView";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditEmailScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Custom alert modal
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: AlertModalType;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

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

      setAlertModal({
        visible: true,
        type: "success",
        title: "Email Updated",
        message: "Your email address has been updated successfully.",
        confirmText: "OK",
        onConfirm: () => {
          setAlertModal((prev) => ({ ...prev, visible: false }));
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/nonpatient/dashboard/profile");
          }
        },
      });
    } catch (err) {
      console.error("Failed to update email:", err);
      setAlertModal({
        visible: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update email address. Please try again.",
        confirmText: "OK",
      });
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
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          extraScrollHeight={65}
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
          <NoteBox
            text="A valid email ensures you receive important security alerts, health reports, and system notifications."
            style={{ marginBottom: 28 }}
          />

          <View style={styles.buttonWrapper}>
            <Button
              title="Save Changes"
              loading={loading}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

      <CustomAlertModal
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={alertModal.confirmText || "OK"}
        onConfirm={
          alertModal.onConfirm ||
          (() => setAlertModal((prev) => ({ ...prev, visible: false })))
        }
        onClose={() => setAlertModal((prev) => ({ ...prev, visible: false }))}
      />
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
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
  buttonWrapper: {
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#0AA7A8",
    height: 52,
    borderRadius: 14,
  },
});
