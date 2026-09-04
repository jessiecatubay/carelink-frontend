import { ImageSourcePropType } from "react-native";

export interface RemoteCommand {
  command: "FOOD" | "WATER" | "ASSISTANCE" | "EMERGENCY";
  id: string;
  recordedAt: string;
  status: "Pending" | "Satisfied";
};

type NotificationType = "Emergency" | "Requests";
type NotificationStatus = "Pending" | "Satisfied";


export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  status: NotificationStatus;
  icon: ImageSourcePropType;
  iconColor: string;
  iconBackground: string;
};