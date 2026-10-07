import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ManualChapter {
  id: string;
  chapterNumber: number;
  tag: string;
  title: string;
  subtitle: string;
  badgeColor: string;
  badgeTextColor: string;
  content: {
    iconName?: keyof typeof Ionicons.glyphMap;
    localIcon?: any;
    heading: string;
    description: string;
    color?: string;
  }[];
  tipText?: string;
}

const CHAPTERS: ManualChapter[] = [
  {
    id: "overview",
    chapterNumber: 1,
    tag: "GETTING STARTED",
    title: "Welcome to CareLink",
    subtitle: "Your real-time caregiving and emergency response companion.",
    badgeColor: "#E0F2FE",
    badgeTextColor: "#0369A1",
    content: [
      {
        iconName: "hardware-chip-outline",
        heading: "Connected Hardware Unit",
        description:
          "Your patient has a dedicated CareLink hardware button unit connected directly to the cloud via MQTT.",
        color: "#12A5B5",
      },
      {
        iconName: "notifications-outline",
        heading: "Instant Push Notifications",
        description:
          "Whenever a patient presses a button, your mobile device receives instant high-priority alerts with sound and vibration.",
        color: "#F59E0B",
      },
      {
        iconName: "shield-checkmark-outline",
        heading: "Continuous Safety Net",
        description:
          "Keep tabs on your loved ones from anywhere, anytime, with real-time status and emergency contact integration.",
        color: "#10B981",
      },
    ],
    tipText: "CareLink works over cellular and Wi-Fi to deliver urgent alerts in milliseconds.",
  },
  {
    id: "alerts",
    chapterNumber: 2,
    tag: "ALERT SYSTEM",
    title: "Device Alerts & Meanings",
    subtitle: "Understand the 5 primary alert buttons on the patient's device.",
    badgeColor: "#FEE2E2",
    badgeTextColor: "#B91C1C",
    content: [
      {
        localIcon: require("@/assets/icons/red-emergency.png"),
        heading: "Emergency Alert",
        description:
          "Critical alert triggered when the patient requires immediate urgent medical or safety help. Sound and sirens will play.",
        color: "#EF4444",
      },
      {
        localIcon: require("@/assets/icons/food.png"),
        heading: "Food Request",
        description:
          "Patient is requesting a meal, snack, or scheduled dietary assistance.",
        color: "#F97316",
      },
      {
        localIcon: require("@/assets/icons/water.png"),
        heading: "Water Request",
        description:
          "Patient is requesting water or hydration assistance.",
        color: "#0284C7",
      },
      {
        localIcon: require("@/assets/icons/assistance.png"),
        heading: "General Assistance",
        description:
          "Patient needs physical support, help standing, or routine caregiving tasks.",
        color: "#6366F1",
      },
      {
        localIcon: require("@/assets/icons/satisfied.png"),
        heading: "Satisfied / Attended",
        description:
          "Signals that the patient's request has been completed and they are comfortable.",
        color: "#10B981",
      },
    ],
    tipText: "You can acknowledge and resolve active alerts directly from your caregiver dashboard.",
  },
  {
    id: "ai-assistant",
    chapterNumber: 3,
    tag: "SMART FEATURES",
    title: "AI Guidance & Tracking",
    subtitle: "Intelligent recommendations to assist you during emergencies.",
    badgeColor: "#F3E8FF",
    badgeTextColor: "#7E22CE",
    content: [
      {
        iconName: "sparkles-outline",
        heading: "AI Incident Advisory",
        description:
          "Our AI instantly analyzes the emergency alert context and provides step-by-step first-aid and care instructions.",
        color: "#8B5CF6",
      },
      {
        iconName: "medkit-outline",
        heading: "Pill & Medication Reminders",
        description:
          "Schedule customized medication reminders that notify both you and the patient at specified times.",
        color: "#0EA5E9",
      },
      {
        iconName: "call-outline",
        heading: "Emergency Speed-Dial",
        description:
          "Access designated emergency contacts and NDRRMC hotline (911) with one-tap slide emergency calling.",
        color: "#DC2626",
      },
    ],
    tipText: "Check the AI Help tab in the navigation bar whenever you need care guidance.",
  },
  {
    id: "pairing",
    chapterNumber: 4,
    tag: "NEXT STEP",
    title: "Pair With Your Patient",
    subtitle: "Scan your patient's QR code to link accounts and start receiving alerts.",
    badgeColor: "#DCFCE7",
    badgeTextColor: "#15803D",
    content: [
      {
        iconName: "qr-code-outline",
        heading: "1. Ask Patient for QR Code",
        description:
          "Ask the patient to open the CareLink app on their phone and show their connection QR code from their dashboard.",
        color: "#12A5B5",
      },
      {
        iconName: "camera-outline",
        heading: "2. Open Caregiver Scanner",
        description:
          "Point your camera at the patient's QR code. The app will detect the code automatically.",
        color: "#F16A66",
      },
      {
        iconName: "checkmark-done-circle-outline",
        heading: "3. Connect Instantly",
        description:
          "Confirm the patient details to link accounts and begin receiving live notifications.",
        color: "#10B981",
      },
    ],
    tipText: "You're all set! Tap 'Proceed to Pair Patient' below to scan a QR code or enter a code manually.",
  },
];

export default function UserManualScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPairOptionsModal, setShowPairOptionsModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < CHAPTERS.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < CHAPTERS.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      setShowPairOptionsModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const handleSelectScan = async () => {
    setShowPairOptionsModal(false);
    try {
      await AsyncStorage.setItem("@carelink_user_manual_seen", "true");
    } catch (e) {
      console.log("Error saving manual seen:", e);
    }
    router.push("/nonpatient/dashboard/scan-patient" as Href);
  };

  const handleSelectEnterCode = async () => {
    setShowPairOptionsModal(false);
    try {
      await AsyncStorage.setItem("@carelink_user_manual_seen", "true");
    } catch (e) {
      console.log("Error saving manual seen:", e);
    }
    router.push("/(protected)/device-pairing" as Href);
  };

  const isLastChapter = currentIndex === CHAPTERS.length - 1;

  const renderChapter = ({ item }: { item: ManualChapter }) => {
    return (
      <View style={styles.slideWrapper}>
        <ScrollView
          style={styles.slideScroll}
          contentContainerStyle={styles.slideContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          bounces={true}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.tagBadge,
                { backgroundColor: item.badgeColor },
              ]}
            >
              <Text
                style={[
                  styles.tagBadgeText,
                  { color: item.badgeTextColor },
                ]}
              >
                {item.tag} • CHAPTER {item.chapterNumber}
              </Text>
            </View>

            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </View>

          {/* Content Items */}
          <View style={styles.itemsContainer}>
            {item.content.map((point, idx) => (
              <View key={idx} style={styles.pointCard}>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: `${point.color || "#12A5B5"}15` },
                  ]}
                >
                  {point.localIcon ? (
                    <Image
                      source={point.localIcon}
                      style={styles.localIcon}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name={point.iconName || "information-circle-outline"}
                      size={24}
                      color={point.color || "#12A5B5"}
                    />
                  )}
                </View>

                <View style={styles.pointTextContent}>
                  <Text style={styles.pointHeading}>{point.heading}</Text>
                  <Text style={styles.pointDesc}>{point.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pro Tip Box */}
          {item.tipText ? (
            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={18} color="#D97706" />
              <Text style={styles.tipText}>{item.tipText}</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Ionicons name="book-outline" size={20} color="#12A5B5" />
          <Text style={styles.topBarTitle}>User Manual</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowPairOptionsModal(true)}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip to Pair</Text>
          <Ionicons name="arrow-forward" size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Progress Dots & Chapter Tracker */}
      <View style={styles.progressContainer}>
        <View style={styles.dotsRow}>
          {CHAPTERS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIndex
                  ? styles.activeDot
                  : idx < currentIndex
                  ? styles.completedDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <Text style={styles.chapterCounter}>
          {currentIndex + 1} of {CHAPTERS.length}
        </Text>
      </View>

      {/* Manual Pages Slider */}
      <FlatList
        ref={flatListRef}
        data={CHAPTERS}
        keyExtractor={(item) => item.id}
        renderItem={renderChapter}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.slider}
      />

      {/* Bottom Action Footer */}
      <View style={styles.footer}>
        {currentIndex > 0 ? (
          <TouchableOpacity
            onPress={handlePrev}
            style={styles.backBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#4B5563" />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.primaryBtn,
            isLastChapter ? styles.scanPrimaryBtn : null,
          ]}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {isLastChapter ? "Proceed to Pair Patient" : "Next Chapter"}
          </Text>
          <Ionicons
            name={isLastChapter ? "link-outline" : "chevron-forward"}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Pairing Method Selection Modal */}
      <Modal
        visible={showPairOptionsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPairOptionsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalOverlayTouch}
            onPress={() => setShowPairOptionsModal(false)}
          />

          <View style={styles.modalSheetContainer}>
            {/* Drag indicator */}
            <View style={styles.modalDragHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="people-outline" size={24} color="#0AA7A8" />
              </View>
              <View style={styles.modalHeaderTextWrap}>
                <Text style={styles.modalTitle}>Pair With Patient</Text>
                <Text style={styles.modalSubtitle}>
                  Choose how you would like to connect:
                </Text>
              </View>
            </View>

            {/* Option 1: Scan QR Code */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleSelectScan}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconWrap, styles.optionIconWrapTeal]}>
                <Ionicons name="qr-code-outline" size={26} color="#0AA7A8" />
              </View>
              <View style={styles.optionTextWrap}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>Scan Patient QR Code</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                  </View>
                </View>
                <Text style={styles.optionDescription}>
                  Point your camera at the QR code displayed on the patient's device or app.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Option 2: Enter Code Manually */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleSelectEnterCode}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconWrap, styles.optionIconWrapCoral]}>
                <Ionicons name="keypad-outline" size={26} color="#F16A66" />
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Enter Code Manually</Text>
                <Text style={styles.optionDescription}>
                  Type the 6-character connection code shown on the patient's screen.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowPairOptionsModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 28,
    backgroundColor: "#12A5B5",
  },
  completedDot: {
    width: 14,
    backgroundColor: "#99F6E4",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#CBD5E1",
  },
  chapterCounter: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  slider: {
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  slideScroll: {
    flex: 1,
  },
  slideContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  cardHeader: {
    marginBottom: 12,
  },
  tagBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  slideSubtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  itemsContainer: {
    gap: 10,
    marginVertical: 6,
  },
  pointCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  localIcon: {
    width: 26,
    height: 26,
  },
  pointTextContent: {
    flex: 1,
  },
  pointHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 3,
  },
  pointDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: "#92400E",
    fontWeight: "500",
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    gap: 4,
  },
  backBtnPlaceholder: {
    width: 80,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#12A5B5",
    gap: 8,
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  scanPrimaryBtn: {
    backgroundColor: "#F16A66",
    shadowColor: "#F16A66",
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalOverlayTouch: {
    flex: 1,
  },
  modalSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  modalDragHandle: {
    width: 44,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: "#B2EBF2",
  },
  modalHeaderTextWrap: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  optionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  optionIconWrapTeal: {
    backgroundColor: "#EDFBFB",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  optionIconWrapCoral: {
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FFE4E6",
  },
  optionTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  recommendedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#15803D",
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  modalCancelBtn: {
    marginTop: 6,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
});
