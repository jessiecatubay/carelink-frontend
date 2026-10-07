import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PickerMode = "calendar" | "clock";
type ClockStage = "hour" | "minute";

type CalendarClockPickerProps = {
  mode: PickerMode;
  value: Date;
  onChange: (value: Date) => void;
  onClose: () => void;
};

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);
const DIAL_SIZE = 232;
const DIAL_VALUE_SIZE = 38;
const DIAL_RADIUS = 84;

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isBeforeToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

function dateWithParts(
  current: Date,
  year: number,
  month: number,
  day: number,
  hour = current.getHours(),
  minute = current.getMinutes(),
) {
  return new Date(year, month, day, hour, minute, 0, 0);
}

export default function CalendarClockPicker({
  mode,
  value,
  onChange,
  onClose,
}: CalendarClockPickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );
  const [clockStage, setClockStage] = useState<ClockStage>("hour");

  if (mode === "calendar") {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    const monthStart = new Date(year, month, 1);
    const canGoBack = monthStart.getTime() > currentMonth.getTime();
    const calendarDays = Array.from({ length: 42 }, (_, index) => {
      const day = index - firstWeekday + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });

    return (
      <View style={styles.panel}>
        <View style={styles.monthHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            disabled={!canGoBack}
            onPress={() => setVisibleMonth(new Date(year, month - 1, 1))}
            style={styles.monthArrow}
          >
            <Ionicons
              name="chevron-back"
              size={19}
              color={canGoBack ? "#334155" : "#CBD5E1"}
            />
          </Pressable>
          <Text style={styles.monthTitle}>
            {visibleMonth.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            onPress={() => setVisibleMonth(new Date(year, month + 1, 1))}
            style={styles.monthArrow}
          >
            <Ionicons name="chevron-forward" size={19} color="#334155" />
          </Pressable>
        </View>

        <View style={styles.calendarGrid}>
          {WEEK_DAYS.map((day, index) => (
            <View key={`${day}-${index}`} style={styles.calendarCell}>
              <Text style={styles.weekDay}>{day}</Text>
            </View>
          ))}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <View key={`empty-${index}`} style={styles.calendarCell} />
              );
            }

            const date = new Date(year, month, day);
            const selected = isSameDay(date, value);
            const disabled = isBeforeToday(date);

            return (
              <View key={date.toISOString()} style={styles.calendarCell}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={date.toLocaleDateString()}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => {
                    onChange(dateWithParts(value, year, month, day));
                    onClose();
                  }}
                  style={[
                    styles.dayButton,
                    selected && styles.selectedDayButton,
                    isSameDay(date, new Date()) &&
                      !selected &&
                      styles.todayButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      disabled && styles.disabledDayText,
                      selected && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  const hour12 = value.getHours() % 12 || 12;
  const meridiem = value.getHours() >= 12 ? "PM" : "AM";
  const currentDialValue = clockStage === "hour" ? hour12 : value.getMinutes();
  const dialValues = clockStage === "hour" ? HOURS : MINUTES;

  const updateMeridiem = (nextMeridiem: "AM" | "PM") => {
    const hour24 = (value.getHours() % 12) + (nextMeridiem === "PM" ? 12 : 0);
    onChange(
      dateWithParts(
        value,
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
        hour24,
      ),
    );
  };

  return (
    <View style={styles.panel}>
      <View style={styles.clockHeader}>
        <Text style={styles.clockTitle}>
          {clockStage === "hour" ? "Choose hour" : "Choose minute"}
        </Text>
        <Pressable onPress={onClose} style={styles.doneButton}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.timeReadout}>
        <Pressable onPress={() => setClockStage("hour")}>
          <Text
            style={[
              styles.timePart,
              clockStage === "hour" && styles.activeTimePart,
            ]}
          >
            {String(hour12).padStart(2, "0")}
          </Text>
        </Pressable>
        <Text style={styles.timeColon}>:</Text>
        <Pressable onPress={() => setClockStage("minute")}>
          <Text
            style={[
              styles.timePart,
              clockStage === "minute" && styles.activeTimePart,
            ]}
          >
            {String(value.getMinutes()).padStart(2, "0")}
          </Text>
        </Pressable>
        <View style={styles.meridiemColumn}>
          {(["AM", "PM"] as const).map((period) => (
            <Pressable
              key={period}
              onPress={() => updateMeridiem(period)}
              style={[
                styles.meridiemButton,
                meridiem === period && styles.selectedMeridiemButton,
              ]}
            >
              <Text
                style={[
                  styles.meridiemText,
                  meridiem === period && styles.selectedMeridiemText,
                ]}
              >
                {period}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.dial}>
        <View style={styles.dialCenter} />
        {dialValues.map((dialValue, index) => {
          const angle = (index / dialValues.length) * Math.PI * 2 - Math.PI / 2;
          const left =
            DIAL_SIZE / 2 + Math.cos(angle) * DIAL_RADIUS - DIAL_VALUE_SIZE / 2;
          const top =
            DIAL_SIZE / 2 + Math.sin(angle) * DIAL_RADIUS - DIAL_VALUE_SIZE / 2;
          const selected = dialValue === currentDialValue;
          const label =
            clockStage === "hour"
              ? String(dialValue)
              : String(dialValue).padStart(2, "0");

          return (
            <Pressable
              key={dialValue}
              accessibilityRole="button"
              accessibilityLabel={
                clockStage === "hour"
                  ? `${dialValue} o'clock`
                  : `${dialValue} minutes`
              }
              accessibilityState={{ selected }}
              onPress={() => {
                if (clockStage === "hour") {
                  const hour24 =
                    (dialValue % 12) + (meridiem === "PM" ? 12 : 0);
                  onChange(
                    dateWithParts(
                      value,
                      value.getFullYear(),
                      value.getMonth(),
                      value.getDate(),
                      hour24,
                    ),
                  );
                  setClockStage("minute");
                  return;
                }

                onChange(
                  dateWithParts(
                    value,
                    value.getFullYear(),
                    value.getMonth(),
                    value.getDate(),
                    value.getHours(),
                    dialValue,
                  ),
                );
              }}
              style={[
                styles.dialValue,
                { left, top },
                selected && styles.selectedDialValue,
              ]}
            >
              <Text
                style={[
                  styles.dialValueText,
                  selected && styles.selectedDialValueText,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.clockHint}>
        {clockStage === "hour"
          ? "Tap an hour, then choose minutes"
          : "Minutes are set in 5-minute steps"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F4F9F9",
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  monthArrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  monthTitle: {
    color: "#203641",
    fontSize: 15,
    fontWeight: "800",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarCell: {
    width: "14.2857%",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDay: {
    color: "#81939A",
    fontSize: 11,
    fontWeight: "700",
  },
  dayButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  todayButton: {
    borderWidth: 1,
    borderColor: "#0B8F91",
  },
  selectedDayButton: {
    backgroundColor: "#0B8F91",
  },
  dayText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },
  disabledDayText: {
    color: "#C5CFD3",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  clockHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clockTitle: {
    color: "#203641",
    fontSize: 14,
    fontWeight: "800",
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#DFF2F0",
  },
  doneText: {
    color: "#0B777A",
    fontSize: 12,
    fontWeight: "800",
  },
  timeReadout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    gap: 4,
  },
  timePart: {
    minWidth: 47,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
    color: "#647780",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  activeTimePart: {
    backgroundColor: "#DFF2F0",
    color: "#0B777A",
  },
  timeColon: {
    color: "#647780",
    fontSize: 23,
    fontWeight: "700",
  },
  meridiemColumn: {
    gap: 3,
    marginLeft: 8,
  },
  meridiemButton: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  selectedMeridiemButton: {
    backgroundColor: "#0B8F91",
  },
  meridiemText: {
    color: "#647780",
    fontSize: 10,
    fontWeight: "700",
  },
  selectedMeridiemText: {
    color: "#FFFFFF",
  },
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignSelf: "center",
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: "#E7F0F1",
  },
  dialCenter: {
    position: "absolute",
    top: DIAL_SIZE / 2 - 3,
    left: DIAL_SIZE / 2 - 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0B8F91",
  },
  dialValue: {
    position: "absolute",
    width: DIAL_VALUE_SIZE,
    height: DIAL_VALUE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: DIAL_VALUE_SIZE / 2,
  },
  selectedDialValue: {
    backgroundColor: "#0B8F91",
  },
  dialValueText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "700",
  },
  selectedDialValueText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  clockHint: {
    marginTop: 10,
    color: "#73878F",
    fontSize: 11,
    textAlign: "center",
  },
});
