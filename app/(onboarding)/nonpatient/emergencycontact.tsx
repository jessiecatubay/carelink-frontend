import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import PhoneInput from "@/components/ui/PhoneInput";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  nonPatientOnboardingSchema,
  type NonPatientOnboardingInput,
} from "@/schema/api";
import { formatPhilippinePhoneNumber } from "@/utils/phone";
import { capitalizeWords, formatNameInput } from "@/utils/string";

type FieldName = keyof NonPatientOnboardingInput;
type FormErrors = Partial<Record<FieldName, string>>;

const initialForm: NonPatientOnboardingInput = {
  fullName: "",
  relationship: "",
  phoneNumber: "",
};

function getFormErrors(form: NonPatientOnboardingInput): FormErrors {
  const result = nonPatientOnboardingSchema.safeParse(form);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<FormErrors>((errors, issue) => {
    const field = issue.path[0] as FieldName;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
    return errors;
  }, {});
}

export default function EmergencyContactScreen() {
  const router = useRouter();
  const { setData } = useOnboarding();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: FieldName, value: string) => {
    let sanitized = value;
    if (field === "phoneNumber") {
      sanitized = formatPhilippinePhoneNumber(value.replace(/[\r\n]/g, ""));
    } else if (field === "fullName" || field === "relationship") {
      sanitized = formatNameInput(value);
    }

    setForm((currentForm) => ({ ...currentForm, [field]: sanitized }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    const formattedFullName = capitalizeWords(form.fullName);
    const formattedRelationship = capitalizeWords(form.relationship);

    const submissionForm = {
      ...form,
      fullName: formattedFullName,
      relationship: formattedRelationship,
    };

    const result = nonPatientOnboardingSchema.safeParse(submissionForm);

    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as FieldName;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setData((prev) => ({
      ...prev,
      emergencyContactName: formattedFullName,
      emergencyContact: result.data.phoneNumber,
      relationship: formattedRelationship,
    }));
    // Navigate to notification setup
    router.push("/(onboarding)/nonpatient/notificationsetup");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View>
          {/* Progress */}
          <View style={styles.paginationWrap}>
            <PaginationDots currentIndex={4} total={6} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Emergency Contact</Text>

          {/* Description */}
          <Text style={styles.subtitle}>
            Who should be contacted in{"\n"}case of emergency?
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <TextInput
              style={[
                styles.input,
                focusedField === "fullName" ? styles.inputFocused : null,
                fieldErrors.fullName ? styles.inputError : null,
              ]}
              placeholder="Full Name"
              placeholderTextColor="#8E8E93"
              value={form.fullName}
              onChangeText={(value) => updateField("fullName", value)}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              textContentType="name"
              autoComplete="name"
            />
            {fieldErrors.fullName ? (
              <Text style={styles.error}>{fieldErrors.fullName}</Text>
            ) : null}

            <TextInput
              style={[
                styles.input,
                focusedField === "relationship" ? styles.inputFocused : null,
                fieldErrors.relationship ? styles.inputError : null,
              ]}
              placeholder="Relationship (e.g. Daughter, Spouse)"
              placeholderTextColor="#8E8E93"
              value={form.relationship}
              onChangeText={(value) => updateField("relationship", value)}
              onFocus={() => setFocusedField("relationship")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              autoComplete="off"
            />
            {fieldErrors.relationship ? (
              <Text style={styles.error}>{fieldErrors.relationship}</Text>
            ) : null}

            <PhoneInput
              placeholder="900 000 0000"
              value={form.phoneNumber}
              onChangeText={(value) => updateField("phoneNumber", value)}
              error={fieldErrors.phoneNumber}
            />
          </View>

          {/* Note */}
          <View style={styles.noteBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#12A5B5"
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Note: </Text>
              In case of an emergency, caregivers and people connected to the patient can access who will be contacted for immediate assistance.
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonWrap}>
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
          />
        </View>
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
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  paginationWrap: {
    marginTop: 100,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#12A5B5",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 16,
  },
  input: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    fontSize: 16,
    color: "#111111",
  },
  inputFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: "#F16A66",
  },
  error: {
    color: "#F16A66",
    fontSize: 13,
    marginTop: -10,
    marginBottom: -4,
    paddingHorizontal: 4,
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
    marginTop: 18,
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
  noteBold: {
    fontWeight: "700",
    color: "#12A5B5",
  },
  buttonWrap: {
    marginBottom: 40,
  },
  button: {
    width: "100%",
  },
});
