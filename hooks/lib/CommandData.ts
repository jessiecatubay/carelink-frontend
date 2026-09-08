import {
  CommandType,
  Notification,
} from "@/types/command";

export const CommandData: Record<
  CommandType,
  Omit<Notification, "id" | "time" | "status">
> = {
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
    iconColor: "#2D9CDB",
    iconBackground: "#EAF6FF",
  },

  ASSISTANCE: {
    title: "Needs Assistance",
    description: "Patient requested assistance",
    type: "Requests",
    icon: require("@/assets/icons/assistance.png"),
    iconColor: "#F2C94C",
    iconBackground: "#FFF9E6",
  },

  EMERGENCY: {
    title: "Emergency",
    description: "Patient triggered an emergency",
    type: "Emergency",
    icon: require("@/assets/icons/emergency.png"),
    iconColor: "#EB5757",
    iconBackground: "#FFECEC",
  },

  SATISFIED: {
    title: "Satisfied",
    description: "Needs satisfied",
    type: "Satisfied",
    icon: require("@/assets/icons/satisfied.png"),
    iconColor: "#2cb16e",
    iconBackground: "#ffffff",
  },
};