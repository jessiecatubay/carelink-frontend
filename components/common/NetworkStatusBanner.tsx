import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  addNetworkStatusListener,
  initNetworkMonitor,
} from "@/services/networkMonitor";

type BannerStatus = "offline" | "restored" | "hidden";

export default function NetworkStatusBanner() {
  const insets = useSafeAreaInsets();

  const [status, setStatus] = useState<BannerStatus>("hidden");
  const wasOfflineRef = useRef(false);
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialCheckDoneRef = useRef(false);

  const animateBanner = (show: boolean, onFinish?: () => void) => {
    Animated.spring(slideAnim, {
      toValue: show ? 0 : -150,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      onFinish?.();
    });
  };

  useEffect(() => {
    initNetworkMonitor();

    const unsubscribe = addNetworkStatusListener((isOnline) => {
      // Avoid false-positive flash on initial mount if already online
      if (!initialCheckDoneRef.current) {
        initialCheckDoneRef.current = true;
        if (isOnline) {
          return;
        }
      }

      if (!isOnline) {
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = null;
        }
        wasOfflineRef.current = true;
        setStatus("offline");
        animateBanner(true);
      } else if (wasOfflineRef.current) {
        // Transition from offline -> back online
        wasOfflineRef.current = false;
        setStatus("restored");
        animateBanner(true);

        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
        }
        dismissTimerRef.current = setTimeout(() => {
          animateBanner(false, () => {
            setStatus("hidden");
          });
        }, 2500);
      }
    });

    return () => {
      unsubscribe();
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  if (status === "hidden") {
    return null;
  }

  const isRestored = status === "restored";

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.banner,
          {
            paddingTop: insets.top + 8,
            backgroundColor: isRestored ? "#059669" : "#DC2626",
            transform: [{ translateY: slideAnim }],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={isRestored ? "wifi-check" : "wifi-off"}
              size={22}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {isRestored ? "Back Online" : "No Internet Connection"}
            </Text>
            <Text style={styles.subtitle}>
              {isRestored
                ? "Connection has been restored."
                : "Please check your Wi-Fi or mobile data."}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    elevation: 999,
  },
  banner: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
});
