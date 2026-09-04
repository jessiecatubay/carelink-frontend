export const CommandData = {
  FOOD: {
    title: "Needs Food",
    description: "Patient requested food",
    type: "Requests",
    icon: require("@/assets/icons/food.png"),
    iconColor: "#FF6D2E",
    iconBackground: "#FFF1E9",
  },
  WATER: {
    title: "Needs Water",
    description: "Patient requested water",
    type: "Requests",
    icon: require("@/assets/icons/water.png"),
    iconColor: "#159FE8",
    iconBackground: "#E6F5FF",
  },
  ASSISTANCE: {
    title: "Needs Assistance",
    description: "Patient requested assistance",
    type: "Requests",
    icon: require("@/assets/icons/assistance.png"),
    iconColor: "#0BA2A8",
    iconBackground: "#E5F8F8",
  },
  EMERGENCY: {
    title: "Emergency Alert",
    description: "Patient pressed emergency",
    type: "Emergency",
    icon: require("@/assets/icons/emergency.png"),
    iconColor: "#FFFFFF",
    iconBackground: "#FF5753",
  },
} as const;
