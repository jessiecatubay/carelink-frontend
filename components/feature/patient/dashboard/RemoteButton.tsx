import { triggerAppHaptic, triggerAppVibration } from "@/context/HapticsContext";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

type RemoteButtonProps = {
  label: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  cardStyle?: ViewStyle;
  isEmergency?: boolean;
  disabled?: boolean;
  cooldown?: number;
};

export default function RemoteButton({
  label,
  icon,
  onPress,
  cardStyle,
  isEmergency = false,
  disabled = false,
  cooldown,
}: RemoteButtonProps) {
  const isButtonDisabled = disabled || (typeof cooldown === "number" && cooldown > 0);

  const handlePress = () => {
    if (isButtonDisabled) return;
    if (isEmergency) {
      triggerAppHaptic("heavy");
      triggerAppVibration([0, 80, 50, 80]);
    } else {
      triggerAppHaptic("medium");
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        cardStyle,
        isEmergency ? styles.emergencyCard : styles.defaultCard,
        isButtonDisabled && styles.disabledCard,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isButtonDisabled}
    >
      <Image
        source={icon}
        style={[styles.cardIcon, isEmergency && styles.whiteIcon]}
        resizeMode="contain"
      />
      <Text style={[styles.cardText, isEmergency && styles.whiteText]}>
        {cooldown && cooldown > 0 ? `${label} (${cooldown}s)` : label}
      </Text>
      {cooldown && cooldown > 0 ? (
        <View style={styles.cooldownPill}>
          <Text style={styles.cooldownPillText}>{cooldown}s cooldown</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 140,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    // Premium drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  disabledCard: {
    opacity: 0.35,
  },
  defaultCard: {
    backgroundColor: "#F7F7F7",
  },
  emergencyCard: {
    backgroundColor: "#F16A66", // solid red/coral
  },
  cardIcon: {
    width: 58,
    height: 58,
    marginBottom: 10,
  },
  whiteIcon: {
    tintColor: "#FFFFFF",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  whiteText: {
    color: "#FFFFFF",
  },
  cooldownPill: {
    marginTop: 4,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cooldownPillText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#64748B",
  },
});
