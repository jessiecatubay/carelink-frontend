import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
};

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  destructive = false,
}: SettingRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={styles.row}
    >
      <Ionicons
        name={icon}
        size={21}
        color={destructive ? "#FF615D" : "#0AA7A8"}
        style={styles.rowIcon}
      />
      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ?? (
        <Ionicons name="chevron-forward" size={19} color="#686D70" />
      )}
    </Pressable>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(true);
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Kathryn Bernardo";
  const email = user?.email || "kathryn@gmail.com";

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);
  };

  const toggle = (value: boolean, onChange: (nextValue: boolean) => void) => (
    <Switch
      accessibilityRole="switch"
      ios_backgroundColor="#D7DDDE"
      onValueChange={onChange}
      thumbColor="#FFFFFF"
      trackColor={{ false: "#D7DDDE", true: "#0AA7A8" }}
      value={value}
    />
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={25} color="#202124" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Section title="ACCOUNT">
          <SettingRow
            icon="person"
            title="Profile"
            subtitle={`${fullName}\n${email}\n+639 636 938 171`}
          />
          <SettingRow
            icon="lock-closed"
            title="Change Password"
            onPress={() =>
              Alert.alert(
                "Change Password",
                "Password changes are managed from your account.",
              )
            }
          />
        </Section>
        <Section title="PATIENT MANAGEMENT">
          <SettingRow
            icon="accessibility"
            title="Manage Patient"
            subtitle="View patient profile, edit illness, notes"
            onPress={() =>
              Alert.alert(
                "Manage Patient",
                "Patient management is not available yet.",
              )
            }
          />
          <SettingRow
            icon="qr-code"
            title="Device Pairing"
            subtitle="Show QR code, generate new code"
            onPress={() =>
              Alert.alert(
                "Device Pairing",
                "Device pairing is not available yet.",
              )
            }
          />
        </Section>
        <Section title="NOTIFICATIONS">
          <SettingRow
            icon="notifications"
            title="Notifications"
            trailing={toggle(notificationsEnabled, setNotificationsEnabled)}
          />
          <SettingRow
            icon="notifications-off"
            title="Emergency Alerts"
            subtitle="Always on"
            trailing={
              <View style={styles.alwaysOn}>
                <Text style={styles.alwaysOnText}>Always on</Text>
              </View>
            }
          />
          <SettingRow
            icon="volume-high"
            title="Alert Sound"
            trailing={toggle(alertSoundEnabled, setAlertSoundEnabled)}
          />
        </Section>
        <Section title="EMERGENCY SETTINGS">
          <SettingRow
            icon="call"
            title="Emergency Contacts"
            subtitle="Add or edit emergency contacts"
            onPress={() =>
              Alert.alert(
                "Emergency Contacts",
                "Emergency contacts are not available yet.",
              )
            }
          />
        </Section>
        <Section title="DATA & SECURITY">
          <SettingRow
            icon="document-text"
            title="Terms & Conditions"
            onPress={() => Alert.alert("Terms & Conditions")}
          />
          <SettingRow
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() => Alert.alert("Privacy Policy")}
          />
        </Section>
        <Section title="ACCOUNT ACTIONS">
          <SettingRow
            destructive
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#FFFFFF", flex: 1 },
  header: {
    alignItems: "center",
    borderBottomColor: "#F0F2F3",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 57,
    justifyContent: "space-between",
    paddingHorizontal: 23,
  },
  headerTitle: { color: "#17191B", fontSize: 17, fontWeight: "700" },
  headerSpacer: { width: 25 },
  content: { paddingBottom: 26, paddingHorizontal: 11, paddingTop: 17 },
  section: { marginBottom: 17 },
  sectionTitle: {
    color: "#707477",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  sectionCard: {
    borderColor: "#DADDE0",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#E4E6E7",
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 13,
  },
  rowIcon: { marginRight: 10, textAlign: "center", width: 19 },
  rowCopy: { flex: 1, justifyContent: "center", paddingVertical: 7 },
  rowTitle: { color: "#25282A", fontSize: 14 },
  rowSubtitle: { color: "#85898B", fontSize: 11, lineHeight: 14 },
  destructiveText: { color: "#FF615D" },
  alwaysOn: {
    backgroundColor: "#0AA7A8",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  alwaysOnText: { color: "#FFFFFF", fontSize: 8 },
});
