import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  nonPatientOnboardingSchema,
  type NonPatientOnboardingInput,
} from "@/schema/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FieldName = keyof NonPatientOnboardingInput;
type FormErrors = Partial<Record<FieldName, string>>;

const initialForm: NonPatientOnboardingInput = {
  phoneNumber: "",
  relationship: "",
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
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );

  const errors = getFormErrors(form);

  const updateField = (field: FieldName, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
  };

  const handleContinue = () => {
    const result = nonPatientOnboardingSchema.safeParse(form);
    setTouched({ phoneNumber: true, relationship: true });

    if (!result.success) {
      return;
    }

    setData((prev) => ({
      ...prev,
      emergencyContact: result.data.phoneNumber,
      relationship: result.data.relationship,
    }));
    // Navigate to notification setup
    router.push("/(onboarding)/nonpatient/notificationsetup");
  };

  const renderError = (field: FieldName) =>
    touched[field] && errors[field] ? (
      <Text style={styles.error}>{errors[field]}</Text>
    ) : null;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Progress */}
        <View style={styles.paginationWrap}>
          <PaginationDots currentIndex={4} total={7} />
        </View>

        {/* Centered Content */}
        <View style={styles.content}>
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
                touched.phoneNumber && errors.phoneNumber
                  ? styles.inputError
                  : null,
              ]}
              placeholder="Phone Number"
              placeholderTextColor="#8E8E93"
              value={form.phoneNumber}
              onChangeText={(value) => updateField("phoneNumber", value)}
              keyboardType="phone-pad"
            />
            {renderError("phoneNumber")}

            <TextInput
              style={[
                styles.input,
                touched.relationship && errors.relationship
                  ? styles.inputError
                  : null,
              ]}
              placeholder="Relationship"
              placeholderTextColor="#8E8E93"
              value={form.relationship}
              onChangeText={(value) => updateField("relationship", value)}
            />
            {renderError("relationship")}
          </View>
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
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
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#7A7A7A",
    lineHeight: 22,
    marginBottom: 40,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 20,
  },
  input: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#7A7A7A",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    fontSize: 16,
    color: "#111111",
  },
  inputError: {
    borderColor: "#F16A66",
  },
  error: {
    color: "#F16A66",
    fontSize: 13,
    marginTop: -12,
    marginBottom: -8,
    paddingHorizontal: 4,
  },
  button: {
    width: "100%",
  },
});
