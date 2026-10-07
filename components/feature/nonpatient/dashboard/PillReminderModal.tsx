import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import CalendarClockPicker from "@/components/feature/nonpatient/dashboard/CalendarClockPicker";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PillReminderModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    scheduledAt: Date,
  ) => Promise<void>;
};

function getNextHour() {
  const nextHour = new Date();
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(nextHour.getHours() + 1);
  return nextHour;
}

export default function PillReminderModal({
  visible,
  onClose,
  onSave,
}: PillReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState(getNextHour);
  const [pickerMode, setPickerMode] = useState<"calendar" | "clock" | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle("");
      setDescription("");
      setScheduledAt(getNextHour());
      setPickerMode(null);
      setError("");
    }
  }, [visible]);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter the pill name to continue.");
      return;
    }
    if (scheduledAt.getTime() <= Date.now()) {
      setError("Choose a future date and time.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave(trimmedTitle, description.trim(), scheduledAt);
      onClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this reminder. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modal}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>MEDICATION PLAN</Text>
              <Text style={styles.heading}>New pill reminder</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close reminder form"
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color="#334155" />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            <Text style={styles.label}>Pill name</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Vitamin D"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              returnKeyType="next"
              maxLength={100}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Dosage or notes (optional)"
              placeholderTextColor="#94A3B8"
              style={[styles.input, styles.descriptionInput]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

            <Text style={styles.label}>Date and time</Text>
            <View style={styles.dateTimeRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose reminder date"
                onPress={() =>
                  setPickerMode(pickerMode === "calendar" ? null : "calendar")
                }
                style={[
                  styles.dateTimeInputWrap,
                  styles.dateInputWrap,
                  pickerMode === "calendar" && styles.dateTimeButtonActive,
                ]}
              >
                <Ionicons name="calendar-outline" size={18} color="#0B8F91" />
                <View style={styles.dateTimeCopy}>
                  <Text style={styles.dateTimeCaption}>DATE</Text>
                  <Text style={styles.dateTimeValue} numberOfLines={1}>
                    {scheduledAt.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose reminder time"
                onPress={() =>
                  setPickerMode(pickerMode === "clock" ? null : "clock")
                }
                style={[
                  styles.dateTimeInputWrap,
                  styles.timeInputWrap,
                  pickerMode === "clock" && styles.dateTimeButtonActive,
                ]}
              >
                <Ionicons name="time-outline" size={18} color="#0B8F91" />
                <View style={styles.dateTimeCopy}>
                  <Text style={styles.dateTimeCaption}>TIME</Text>
                  <Text style={styles.dateTimeValue} numberOfLines={1}>
                    {scheduledAt.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </Pressable>
            </View>

            {pickerMode ? (
              <CalendarClockPicker
                mode={pickerMode}
                value={scheduledAt}
                onChange={setScheduledAt}
                onClose={() => setPickerMode(null)}
              />
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={saving}
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save reminder</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
  },
  modal: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "92%",
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#E7EFF1",
  },
  eyebrow: {
    color: "#0B8F91",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heading: {
    marginTop: 4,
    color: "#172B35",
    fontSize: 21,
    fontWeight: "800",
  },
  closeButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#F0F5F6",
  },
  form: {
    padding: 22,
    paddingBottom: 24,
  },
  label: {
    marginBottom: 7,
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 48,
    marginBottom: 18,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#D9E4E7",
    borderRadius: 10,
    color: "#172B35",
    fontSize: 15,
  },
  descriptionInput: {
    height: 92,
    paddingTop: 12,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateTimeInputWrap: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: "#D9E4E7",
    borderRadius: 10,
  },
  dateInputWrap: {
    flex: 1.4,
  },
  timeInputWrap: {
    flex: 1,
  },
  dateTimeButtonActive: {
    borderColor: "#0B8F91",
    backgroundColor: "#F4F9F9",
  },
  dateTimeCopy: {
    flex: 1,
  },
  dateTimeCaption: {
    color: "#83939A",
    fontSize: 9,
    fontWeight: "800",
  },
  dateTimeValue: {
    marginTop: 2,
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },
  error: {
    marginTop: 14,
    color: "#C2413B",
    fontSize: 13,
    lineHeight: 18,
  },
  saveButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    borderRadius: 10,
    backgroundColor: "#0B8F91",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
