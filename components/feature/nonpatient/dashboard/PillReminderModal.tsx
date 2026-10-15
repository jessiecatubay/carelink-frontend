import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    scheduledAt: string;
    daysOfWeek?: number[];
    timeString?: string | null;
  } | null;
  onSave: (
    title: string,
    description: string,
    scheduledAt: Date,
    daysOfWeek?: number[],
    timeString?: string,
    id?: string,
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

const DAYS_OF_WEEK = [
  { label: "M", name: "Mon", value: 1 },
  { label: "T", name: "Tue", value: 2 },
  { label: "W", name: "Wed", value: 3 },
  { label: "T", name: "Thu", value: 4 },
  { label: "F", name: "Fri", value: 5 },
  { label: "S", name: "Sat", value: 6 },
  { label: "S", name: "Sun", value: 0 },
];

const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [6, 0];

function getNextHour() {
  const nextHour = new Date();
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(nextHour.getHours() + 1);
  return nextHour;
}

export default function PillReminderModal({
  visible,
  onClose,
  initialData,
  onSave,
  onDelete,
}: PillReminderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleType, setScheduleType] = useState<"recurring" | "once">(
    "recurring",
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(ALL_DAYS); // Default to Everyday
  const [scheduledAt, setScheduledAt] = useState(getNextHour);
  const [pickerMode, setPickerMode] = useState<"calendar" | "clock" | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        const hasRecurringDays =
          Array.isArray(initialData.daysOfWeek) &&
          initialData.daysOfWeek.length > 0;
        setScheduleType(hasRecurringDays ? "recurring" : "once");
        setSelectedDays(
          hasRecurringDays ? initialData.daysOfWeek! : ALL_DAYS,
        );
        if (initialData.timeString) {
          const [hStr, mStr] = initialData.timeString.split(":");
          const h = parseInt(hStr || "0", 10);
          const m = parseInt(mStr || "0", 10);
          const d = new Date(initialData.scheduledAt);
          const baseDate = Number.isNaN(d.getTime()) ? new Date() : d;
          baseDate.setHours(h, m, 0, 0);
          setScheduledAt(baseDate);
        } else {
          const parsedDate = new Date(initialData.scheduledAt);
          setScheduledAt(
            Number.isNaN(parsedDate.getTime()) ? getNextHour() : parsedDate,
          );
        }
      } else {
        setTitle("");
        setDescription("");
        setScheduleType("recurring");
        setSelectedDays(ALL_DAYS);
        setScheduledAt(getNextHour());
      }
      setPickerMode(null);
      setError("");
    }
  }, [visible, initialData]);

  const toggleDay = (dayValue: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayValue)) {
        return prev.filter((d) => d !== dayValue);
      } else {
        return [...prev, dayValue];
      }
    });
  };

  const handleQuickSelect = (days: number[]) => {
    setSelectedDays(days);
  };

  const isAllDaysSelected = selectedDays.length === 7;
  const isWeekdaysSelected =
    selectedDays.length === 5 &&
    WEEKDAYS.every((d) => selectedDays.includes(d));
  const isWeekendsSelected =
    selectedDays.length === 2 &&
    WEEKENDS.every((d) => selectedDays.includes(d));

  const getRecurrenceSummary = () => {
    if (selectedDays.length === 0) return "Please select at least one day";
    if (isAllDaysSelected) return "Repeats every day";
    if (isWeekdaysSelected) return "Repeats every weekday (Mon - Fri)";
    if (isWeekendsSelected) return "Repeats every weekend (Sat, Sun)";

    const sorted = [...selectedDays].sort(
      (a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b),
    );
    const names = sorted.map((val) => {
      const found = DAYS_OF_WEEK.find((d) => d.value === val);
      return found ? found.name : "";
    });
    return `Repeats on ${names.join(", ")}`;
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;

    setDeleting(true);
    setError("");
    try {
      await onDelete(initialData.id);
      onClose();
    } catch (delError) {
      setError(
        delError instanceof Error
          ? delError.message
          : "Unable to delete this reminder. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter the pill name to continue.");
      return;
    }

    if (scheduleType === "recurring") {
      if (selectedDays.length === 0) {
        setError("Select at least one day for daily intake.");
        return;
      }

      const hours = scheduledAt.getHours();
      const minutes = scheduledAt.getMinutes();
      const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setSaving(true);
      setError("");
      try {
        await onSave(
          trimmedTitle,
          description.trim(),
          scheduledAt,
          selectedDays,
          timeString,
          initialData?.id,
        );
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
    } else {
      if (!isEditing && scheduledAt.getTime() <= Date.now()) {
        setError("Choose a future date and time.");
        return;
      }

      const hours = scheduledAt.getHours();
      const minutes = scheduledAt.getMinutes();
      const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setSaving(true);
      setError("");
      try {
        await onSave(
          trimmedTitle,
          description.trim(),
          scheduledAt,
          undefined,
          timeString,
          initialData?.id,
        );
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
              <Text style={styles.heading}>
                {isEditing ? "Edit pill reminder" : "New pill reminder"}
              </Text>
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
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            <Text style={styles.label}>Pill name</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Vitamin D, Biogesic"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              returnKeyType="next"
              maxLength={100}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Dosage or notes (e.g. 1 capsule after meal)"
              placeholderTextColor="#94A3B8"
              style={[styles.input, styles.descriptionInput]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

            {/* Schedule Type Selector */}
            <Text style={styles.label}>Schedule Type</Text>
            <View style={styles.scheduleTypeContainer}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setScheduleType("recurring");
                  setPickerMode(null);
                }}
                style={[
                  styles.scheduleTypeButton,
                  scheduleType === "recurring" &&
                    styles.scheduleTypeButtonActive,
                ]}
              >
                <Ionicons
                  name="repeat"
                  size={17}
                  color={scheduleType === "recurring" ? "#FFFFFF" : "#64748B"}
                />
                <Text
                  style={[
                    styles.scheduleTypeText,
                    scheduleType === "recurring" &&
                      styles.scheduleTypeTextActive,
                  ]}
                >
                  Repeat on Days
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setScheduleType("once");
                  setPickerMode(null);
                }}
                style={[
                  styles.scheduleTypeButton,
                  scheduleType === "once" && styles.scheduleTypeButtonActive,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color={scheduleType === "once" ? "#FFFFFF" : "#64748B"}
                />
                <Text
                  style={[
                    styles.scheduleTypeText,
                    scheduleType === "once" && styles.scheduleTypeTextActive,
                  ]}
                >
                  One-time Date
                </Text>
              </Pressable>
            </View>

            {scheduleType === "recurring" ? (
              <View style={styles.recurringSection}>
                <View style={styles.daysHeaderRow}>
                  <Text style={styles.subLabel}>Repeat Days</Text>
                  <View style={styles.quickSelectRow}>
                    <Pressable
                      onPress={() => handleQuickSelect(ALL_DAYS)}
                      style={[
                        styles.quickChip,
                        isAllDaysSelected && styles.quickChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          isAllDaysSelected && styles.quickChipTextActive,
                        ]}
                      >
                        Everyday
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleQuickSelect(WEEKDAYS)}
                      style={[
                        styles.quickChip,
                        isWeekdaysSelected && styles.quickChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          isWeekdaysSelected && styles.quickChipTextActive,
                        ]}
                      >
                        Weekdays
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleQuickSelect(WEEKENDS)}
                      style={[
                        styles.quickChip,
                        isWeekendsSelected && styles.quickChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickChipText,
                          isWeekendsSelected && styles.quickChipTextActive,
                        ]}
                      >
                        Weekends
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Day Circles */}
                <View style={styles.daysGrid}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDays.includes(day.value);
                    return (
                      <Pressable
                        key={day.name}
                        onPress={() => toggleDay(day.value)}
                        style={[
                          styles.dayCircle,
                          isSelected && styles.dayCircleSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayCircleLetter,
                            isSelected && styles.dayCircleLetterSelected,
                          ]}
                        >
                          {day.label}
                        </Text>
                        <Text
                          style={[
                            styles.dayCircleName,
                            isSelected && styles.dayCircleNameSelected,
                          ]}
                        >
                          {day.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Recurrence Summary Badge */}
                <View style={styles.summaryBadge}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#0B8F91"
                  />
                  <Text style={styles.summaryBadgeText}>
                    {getRecurrenceSummary()}
                  </Text>
                </View>

                {/* Time Picker for Recurring */}
                <Text style={[styles.subLabel, { marginTop: 14 }]}>
                  Intake Time
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Choose intake time"
                  onPress={() =>
                    setPickerMode(pickerMode === "clock" ? null : "clock")
                  }
                  style={[
                    styles.dateTimeInputWrap,
                    styles.timeOnlyWrap,
                    pickerMode === "clock" && styles.dateTimeButtonActive,
                  ]}
                >
                  <Ionicons name="time-outline" size={20} color="#0B8F91" />
                  <View style={styles.dateTimeCopy}>
                    <Text style={styles.dateTimeCaption}>REMINDER TIME</Text>
                    <Text style={styles.dateTimeValue}>
                      {scheduledAt.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Ionicons
                    name={
                      pickerMode === "clock" ? "chevron-up" : "chevron-down"
                    }
                    size={18}
                    color="#64748B"
                  />
                </Pressable>
              </View>
            ) : (
              /* One-time Date & Time Row */
              <View style={styles.oneTimeSection}>
                <Text style={styles.subLabel}>Date and Time</Text>
                <View style={styles.dateTimeRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Choose reminder date"
                    onPress={() =>
                      setPickerMode(
                        pickerMode === "calendar" ? null : "calendar",
                      )
                    }
                    style={[
                      styles.dateTimeInputWrap,
                      styles.dateInputWrap,
                      pickerMode === "calendar" && styles.dateTimeButtonActive,
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#0B8F91"
                    />
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
              </View>
            )}

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
              disabled={saving || deleting}
              style={[
                styles.saveButton,
                (saving || deleting) && styles.saveButtonDisabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditing ? "Save changes" : "Save reminder"}
                </Text>
              )}
            </Pressable>

            {isEditing && onDelete ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete pill reminder"
                onPress={handleDelete}
                disabled={deleting || saving}
                style={[
                  styles.deleteButton,
                  (deleting || saving) && styles.deleteButtonDisabled,
                ]}
              >
                {deleting ? (
                  <ActivityIndicator color="#EF4444" size="small" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={17} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete reminder</Text>
                  </>
                )}
              </Pressable>
            ) : null}
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
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E7EFF1",
  },
  eyebrow: {
    color: "#12A5B5",
    fontSize: 10.5,
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
    flexGrow: 1,
    padding: 22,
    paddingBottom: 80,
  },
  label: {
    marginBottom: 7,
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
  },
  subLabel: {
    marginBottom: 7,
    color: "#475569",
    fontSize: 12.5,
    fontWeight: "700",
  },
  input: {
    minHeight: 48,
    marginBottom: 16,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#D9E4E7",
    borderRadius: 12,
    color: "#172B35",
    fontSize: 15,
  },
  descriptionInput: {
    height: 80,
    paddingTop: 12,
  },
  scheduleTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  scheduleTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6,
  },
  scheduleTypeButtonActive: {
    backgroundColor: "#12A5B5",
    ...Platform.select({
      ios: {
        shadowColor: "#12A5B5",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scheduleTypeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  scheduleTypeTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  recurringSection: {
    marginBottom: 12,
  },
  daysHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  quickSelectRow: {
    flexDirection: "row",
    gap: 6,
  },
  quickChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },
  quickChipActive: {
    backgroundColor: "#12A5B5",
  },
  quickChipText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#475569",
  },
  quickChipTextActive: {
    color: "#FFFFFF",
  },
  daysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 10,
  },
  dayCircle: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  dayCircleSelected: {
    backgroundColor: "#12A5B5",
    borderColor: "#12A5B5",
    ...Platform.select({
      ios: {
        shadowColor: "#12A5B5",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dayCircleLetter: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },
  dayCircleLetterSelected: {
    color: "#FFFFFF",
  },
  dayCircleName: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 2,
  },
  dayCircleNameSelected: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
    flex: 1,
  },
  oneTimeSection: {
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateTimeInputWrap: {
    flex: 1,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "#D9E4E7",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  timeOnlyWrap: {
    width: "100%",
    justifyContent: "space-between",
  },
  dateInputWrap: {
    flex: 1.4,
  },
  timeInputWrap: {
    flex: 1,
  },
  dateTimeButtonActive: {
    borderColor: "#12A5B5",
    backgroundColor: "#F0FBFC",
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
    color: "#172B35",
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    marginTop: 14,
    color: "#DC2626",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  saveButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: "#12A5B5",
    ...Platform.select({
      ios: {
        shadowColor: "#12A5B5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  deleteButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});
