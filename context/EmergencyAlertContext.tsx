import NDRRMCEmergencyModal, {
  EmergencyModalData,
} from "@/components/ui/NDRRMCEmergencyModal";
import { onPatientAlert } from "@/hooks/lib/socket";
import { playEmergencySiren, stopEmergencySiren } from "@/services/emergencyAudio";
import * as Notifications from "expo-notifications";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyData, setEmergencyData] =
    useState<EmergencyModalData | null>(null);

  const triggerEmergencyAlert = (data?: EmergencyModalData) => {
    const alertInfo: EmergencyModalData = {
      patientName: data?.patientName || "Connected Patient",
      alertType: data?.alertType || "CRITICAL EMERGENCY SOS",
      timestamp: data?.timestamp || new Date().toLocaleTimeString(),
      phoneNumber: data?.phoneNumber,
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

      const command = (payload as any)?.command?.toUpperCase?.() || "";
      const alertType = (payload as any)?.alertType?.toUpperCase?.() || "";
      const type = (payload as any)?.type?.toUpperCase?.() || "";

      const isEmergency =
        command === "EMERGENCY" ||
        alertType === "EMERGENCY" ||
        type === "EMERGENCY" ||
        alertType === "FALL" ||
        command === "FALL";

      if (isEmergency) {
        triggerEmergencyAlert({
          patientName:
            (payload as any)?.patientName ||
            (payload as any)?.patient?.name ||
            "Connected Patient",
          alertType: "🚨 EMERGENCY SOS BROADCAST",
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  // 2. Listen for Push Notifications (foreground received + opened from closed/background state)
  useEffect(() => {
    const handlePushNotification = (notification: Notifications.Notification) => {
      const data = notification.request.content.data as {
        type?: string;
        command?: string;
        alertType?: string;
        patientName?: string;
        phoneNumber?: string;
      };

      const isEmergency =
        data?.type?.toUpperCase?.() === "EMERGENCY" ||
        data?.command?.toUpperCase?.() === "EMERGENCY" ||
        data?.alertType?.toUpperCase?.() === "EMERGENCY" ||
        data?.type?.toUpperCase?.() === "FALL" ||
        notification.request.content.title?.toLowerCase().includes("emergency");

      if (isEmergency) {
        triggerEmergencyAlert({
          patientName: data?.patientName || "Connected Patient",
          alertType: "🚨 EMERGENCY SOS BROADCAST",
          timestamp: new Date().toLocaleTimeString(),
          phoneNumber: data?.phoneNumber,
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
  }, []);

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
