import Logo from "@/components/common/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { nameStepSchema } from "@/schema/auth";
import { updateUser as updateUserApi } from "@/services/auth";
import { capitalizeWords, formatNameInput } from "@/utils/string";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type UserNameStepProps = {
  onContinue: () => void;
};

export default function UserNameStep({ onContinue }: UserNameStepProps) {
  const { user, updateUser } = useAuth();
  const { setData } = useOnboarding();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.firstName && !firstName) {
      setFirstName(user.firstName);
    }
    if (user?.lastName && !lastName) {
      setLastName(user.lastName);
    }
  }, [user]);

  const handleContinue = async () => {
    setGeneralError(null);
    const formattedFirst = capitalizeWords(firstName);
    const formattedLast = capitalizeWords(lastName);

    setFirstName(formattedFirst);
    setLastName(formattedLast);

    const parsed = nameStepSchema.safeParse({ firstName: formattedFirst, lastName: formattedLast });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Update backend user profile if email is available
      if (user?.email) {
        await updateUserApi(user.email, {
          firstName: formattedFirst,
          lastName: formattedLast,
        });
      }

      // Update local auth context
      if (user) {
        await updateUser({
          ...user,
          firstName: formattedFirst,
          lastName: formattedLast,
        });
      }

      // Update onboarding context
      setData((prev) => ({
        ...prev,
        userId: user?.id,
        email: user?.email,
      }));

      onContinue();
    } catch (err: any) {
      console.error("Error saving user name during onboarding:", err);
      // Even if network update encounters an issue, update local state and continue
      if (user) {
        await updateUser({
          ...user,
          firstName: formattedFirst,
          lastName: formattedLast,
        });
      }
      onContinue();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          <Logo />

          <Text style={styles.title}>What{"'"}s your name?</Text>
          <Text style={styles.subtitle}>
            Please enter your first and last name to get started.
          </Text>

          {generalError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{generalError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              placeholder="First Name"
              value={firstName}
              autoCapitalize="words"
              onChangeText={(text) => {
                setFirstName(formatNameInput(text));
                if (errors.firstName) {
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                }
                if (generalError) setGeneralError(null);
              }}
              error={errors.firstName}
            />

            <View style={styles.inputSpacing} />

            <Input
              placeholder="Last Name"
              value={lastName}
              autoCapitalize="words"
              onChangeText={(text) => {
                setLastName(formatNameInput(text));
                if (errors.lastName) {
                  setErrors((prev) => ({ ...prev, lastName: undefined }));
                }
                if (generalError) setGeneralError(null);
              }}
              error={errors.lastName}
            />
          </View>

          <View style={{ flex: 1, minHeight: 40 }} />

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 32,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#12A5B5",
    marginBottom: 4,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 24,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputSpacing: {
    height: 16,
  },
  errorBanner: {
    width: "100%",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorBannerText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
  },
  button: {
    width: "100%",
  },
});
