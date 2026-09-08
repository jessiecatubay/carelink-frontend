import { ImageSourcePropType } from "react-native";

export type CommandType =
  | "FOOD"
  | "WATER"
  | "ASSISTANCE"
  | "EMERGENCY"
  | "SATISFIED";

export type NotificationType =
  | "Emergency"
  | "Requests"
  | "Satisfied";

export type NotificationStatus =
  | "Pending"
  | "Satisfied";

export interface RemoteCommand {
  command: | "FOOD"
  | "WATER"
  | "ASSISTANCE"
  | "EMERGENCY"
  | "SATISFIED";
  id: string;
  recordedAt: string;
  status: NotificationStatus;
}

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
}