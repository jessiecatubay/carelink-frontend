import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

type Props = {
  email: string;
  loading?: boolean;
};

export default function VerificationCard({
  email,
  loading,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>
        We have sent a verification link to your email.
        {"\n"}
        Please check your inbox to continue.
      </Text>

      <View style={styles.emailRow}>
        <Image
          source={require("@/assets/icons/email.png")}
          style={styles.icon}
          resizeMode="contain"
        />

        <View style={styles.divider} />

        <Text style={styles.emailText} numberOfLines={1}>
          {email}
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingRow}>
          <Text style={styles.loadingText}>Waiting for verification...</Text>
          <ActivityIndicator color="#14A3A5" size="small" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  message: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#14A3A5",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  emailText: {
    flex: 1,
    color: "#374151",
    fontSize: 15,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  loadingText: {
    color: "#9CA3AF",
    marginRight: 8,
    fontSize: 14,
  },
});