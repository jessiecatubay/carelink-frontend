import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";

type RemoteButtonProps = {
  label: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  cardStyle?: ViewStyle;
  isEmergency?: boolean;
};

export default function RemoteButton({
  label,
  icon,
  onPress,
  cardStyle,
  isEmergency = false,
}: RemoteButtonProps) {
  const handlePress = () => {
    // Premium haptic feedback to mimic a physical remote button click
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        cardStyle,
        isEmergency ? styles.emergencyCard : styles.defaultCard,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={icon}
        style={[styles.cardIcon, isEmergency && styles.whiteIcon]}
        resizeMode="contain"
      />
      <Text style={[styles.cardText, isEmergency && styles.whiteText]}>
        {label}
      </Text>
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
});
