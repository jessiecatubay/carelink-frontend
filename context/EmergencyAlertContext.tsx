import NDRRMCEmergencyModal, {
  EmergencyModalData,
} from "@/components/ui/NDRRMCEmergencyModal";
import { useAuth } from "@/context/AuthContext";
import { onPatientAlert, onPillReminder } from "@/hooks/lib/socket";
import { playEmergencySiren, stopEmergencySiren } from "@/services/emergencyAudio";
import * as Notifications from "expo-notifications";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

interface EmergencyAlertContextType {
  isEmergencyActive: boolean;
  emergencyData: EmergencyModalData | null;
  triggerEmergencyAlert: (data?: EmergencyModalData) => void;
  dismissEmergencyAlert: () => void;
}

const EmergencyAlertContext = createContext<EmergencyAlertContextType>({
  isEmergencyActive: false,
  emergencyData: null,
  triggerEmergencyAlert: () => {},
  dismissEmergencyAlert: () => {},
});

export function EmergencyAlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyData, setEmergencyData] =
    useState<EmergencyModalData | null>(null);

  const triggerEmergencyAlert = (data?: EmergencyModalData) => {
    // Only non-patients / caregivers should have emergency alerts triggered
    if (user?.role === "PATIENT") {
      return;
    }

    const alertInfo: EmergencyModalData = {
      patientId: data?.patientId,
      patientName: data?.patientName || "Connected Patient",
      alertType: data?.alertType || "🚨 EMERGENCY ALERT",
      timestamp: data?.timestamp || new Date().toLocaleTimeString(),
      phoneNumber: data?.phoneNumber,
      deviceId: data?.deviceId,
    };

    setEmergencyData(alertInfo);
    setIsEmergencyActive(true);

    // Play emergency siren sound (checks alertSoundEnabled internally)
    playEmergencySiren();
  };

  const dismissEmergencyAlert = () => {
    setIsEmergencyActive(false);
    setEmergencyData(null);
    stopEmergencySiren();
  };

  // 1. Listen for real-time WebSocket socket alerts from connected patients
  useEffect(() => {
    const unsubscribe = onPatientAlert((payload) => {
      console.log("🚨 EmergencyAlertContext received socket alert:", payload);

      // Only non-patients (caregivers) should receive notifications
      if (user?.role === "PATIENT") {
        return;
      }

      if (user?.id && payload?.patientId && user.id === payload.patientId && user.role !== "NON_PATIENT") {
        return;
      }

      const command = (payload as any)?.command?.toUpperCase?.() || "";
      const alertType = (payload as any)?.alertType?.toUpperCase?.() || "";
      const type = (payload as any)?.type?.toUpperCase?.() || "";

      if (command === "SATISFIED" || alertType === "SATISFIED") {
        dismissEmergencyAlert();
        return;
      }

      const isEmergency =
        command === "EMERGENCY" ||
        alertType === "EMERGENCY" ||
        type === "EMERGENCY" ||
        alertType === "FALL" ||
        command === "FALL";

      if (isEmergency) {
        triggerEmergencyAlert({
          patientId: (payload as any)?.patientId,
          patientName:
            (payload as any)?.patientName ||
            (payload as any)?.patient?.name ||
            "Connected Patient",
          alertType: "🚨 EMERGENCY ALERT",
          timestamp: (payload as any)?.recordedAt
            ? new Date((payload as any).recordedAt).toLocaleTimeString()
            : new Date().toLocaleTimeString(),
          phoneNumber: (payload as any)?.phoneNumber,
          deviceId: (payload as any)?.deviceId,
        });
      }
      // Note: Non-emergency alerts (Food, Water, Assistance) are delivered as push notifications
      // by the backend to avoid duplicate notifications on the caregiver device, while real-time UI
      // is updated via socket listeners in RecentActivity and Alerts tab.
    });

    return () => {
      unsubscribe?.();
    };
  }, [user?.role, user?.id]);

  // 2. Listen for Push Notifications (foreground received + opened from closed/background state)
  useEffect(() => {
    const handlePushNotification = (notification: Notifications.Notification) => {
      if (user?.role === "PATIENT") {
        return;
      }

      const data = (notification.request.content.data || {}) as {
        type?: string;
        command?: string;
        alertType?: string;
        patientId?: string;
        patientName?: string;
        phoneNumber?: string;
        timestamp?: string;
        deviceId?: string;
      };

      const isEmergency =
        data?.type?.toUpperCase?.() === "EMERGENCY" ||
        data?.command?.toUpperCase?.() === "EMERGENCY" ||
        data?.alertType?.toUpperCase?.() === "EMERGENCY" ||
        data?.type?.toUpperCase?.() === "FALL" ||
        notification.request.content.title?.toLowerCase().includes("emergency");

      if (isEmergency) {
        triggerEmergencyAlert({
          patientId: data?.patientId,
          patientName: data?.patientName || "Connected Patient",
          alertType: "🚨 EMERGENCY ALERT",
          timestamp: data?.timestamp || new Date().toLocaleTimeString(),
          phoneNumber: data?.phoneNumber,
          deviceId: data?.deviceId,
        });
      }
    };

    // When a notification arrives while the app is in foreground
    const notificationListener =
      Notifications.addNotificationReceivedListener((notification) => {
        handlePushNotification(notification);
      });

    // When the user taps/clicks a notification (e.g. from background or lockscreen)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handlePushNotification(response.notification);
      });

    // Check if the app was launched by tapping an emergency notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) {
        handlePushNotification(response.notification);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [user?.role]);

  // 3. Real-time Pill Reminder notifications (for active in-app sessions)
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = onPillReminder(async (payload) => {
      console.log("💊 EmergencyAlertContext received pill reminder:", payload);
      try {
        // Connected caregivers (NON_PATIENT) receive the remote push notification from backend
        // to avoid duplicate notifications. Patients receive this local notification if active.
        if (user.role === "PATIENT") {
          const pillHeader = payload.title?.trim() || "Pill Reminder";
          const pillBody =
            payload.description?.trim() ||
            "It is time to take your scheduled medication.";

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Pill Reminder - " + pillHeader,
              body: pillBody,
              sound: "default",
              priority: Notifications.AndroidNotificationPriority.HIGH,
              vibrate: [0, 250, 250, 250],
              data: payload,
            },
            trigger: null,
          });
        }
      } catch (err) {
        console.warn("Failed to schedule local pill reminder notification:", err);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [user?.role, user?.id]);

  return (
    <EmergencyAlertContext.Provider
      value={{
        isEmergencyActive,
        emergencyData,
        triggerEmergencyAlert,
        dismissEmergencyAlert,
      }}
    >
      {children}

      {/* Fullscreen NDRRMC Centered Emergency Alert Modal */}
      <NDRRMCEmergencyModal
        visible={isEmergencyActive}
        data={emergencyData}
        onDismiss={dismissEmergencyAlert}
      />
    </EmergencyAlertContext.Provider>
  );
}

export function useEmergencyAlert() {
  return useContext(EmergencyAlertContext);
}
