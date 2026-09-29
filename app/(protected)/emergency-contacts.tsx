import PhoneInput from "@/components/ui/PhoneInput";
import SlideToCall911 from "@/components/ui/SlideToCall911";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import {
  formatPhilippinePhoneNumber,
  isValidPhilippinePhoneNumber,
} from "@/utils/phone";
import { capitalizeWords, formatNameInput } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPriority?: boolean;
  patientProfileId?: string;
};

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [activePatientProfileId, setActivePatientProfileId] = useState<string>("");
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const fetchContacts = async () => {
    if (!user?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      // 1. Fetch fresh user data so we always have the latest nonPatientProfile & connections
      let currentUserObj = user;
      try {
        const userRes = await axiosInstance.post("/api/user/v1/get-user-by-id", {
          id: user.id,
        });
        if (userRes.data?.data) {
          currentUserObj = userRes.data.data;
          await updateUser(currentUserObj);
        }
      } catch (e) {
        console.log("Could not refresh user profile in emergency contacts:", e);
      }

      let targetPatientId = "";
      let connectedPatientsList: any[] = [];

      if (currentUserObj?.role === "PATIENT") {
        targetPatientId = currentUserObj?.id || "";
      } else {
        // NON_PATIENT: Query connected patients
        try {
          const result = await axiosInstance.post(
            "/api/patient-nonpatient/v1/connected-patients",
            { nonPatientId: currentUserObj.id },
          );

          const connectedPatients = result.data?.data;
          if (Array.isArray(connectedPatients) && connectedPatients.length > 0) {
            connectedPatientsList = connectedPatients;
            const activeConn =
              connectedPatients.find((c: any) => c.currentPatient) ||
              connectedPatients[0];
            targetPatientId =
              activeConn?.patient?.id ||
              activeConn?.patientId ||
              "";
          }
        } catch (e) {
          console.log("Could not fetch connected patients:", e);
        }
      }

      setActivePatientProfileId(targetPatientId);

      let fetchedList: EmergencyContact[] = [];

      // 2. Fetch emergency contacts from EmergencyContact table
      if (targetPatientId) {
        try {
          const response = await axiosInstance.post(
            "/api/emergency-contact/v1/emergency-contacts/patient",
            { patientProfileId: targetPatientId },
          );

          if (
            response.data?.status === "success" ||
            Array.isArray(response.data?.data)
          ) {
            fetchedList = response.data.data || [];
          }
        } catch (e) {
          console.log("Could not fetch patient emergency contacts:", e);
        }
      }

      // 3. If connected patient has an emergency contact in patientProfile not yet in the list, add it
      if (connectedPatientsList.length > 0) {
        for (const conn of connectedPatientsList) {
          const p = conn.patient;
          if (!p) continue;
          const pPhone = (
            p.patientProfile?.emergencyContact ||
            p.phoneNumber ||
            ""
          ).toString().trim();
          const pName =
            [p.firstName, p.lastName].filter(Boolean).join(" ") || "Patient";

          if (pPhone) {
            const alreadyExists = fetchedList.some(
              (c) =>
                c.phoneNumber?.replace(/\D/g, "") ===
                pPhone.replace(/\D/g, "") && pPhone.length > 0,
            );
            if (!alreadyExists) {
              fetchedList.push({
                id: `patient-profile-contact-${p.id}`,
                name: `${pName}'s Emergency Contact`,
                relationship: "Connected Patient",
                phoneNumber: pPhone,
                isPriority: fetchedList.length === 0,
                patientProfileId: p.id,
              });
            }
          }
        }
      }

      // 4. If current user (NON_PATIENT) has an emergency contact from onboarding or profile, include it
      const userPhone = (
        currentUserObj.emergencyContact ||
        currentUserObj.nonPatientProfile?.emergencyContact ||
        ""
      )
        .toString()
        .trim();

      if (currentUserObj.role === "NON_PATIENT" && userPhone) {
        const userRel =
          currentUserObj.nonPatientProfile?.relationship || "Emergency Contact";
        const contactName =
          currentUserObj.emergencyContactName ||
          currentUserObj.nonPatientProfile?.emergencyContactName ||
          ([currentUserObj.firstName, currentUserObj.lastName]
            .filter(Boolean)
            .join(" ")
            ? `${[currentUserObj.firstName, currentUserObj.lastName].filter(Boolean).join(" ")} (Caregiver)`
            : "Emergency Contact");

        const alreadyExists = fetchedList.some(
          (c) =>
            c.phoneNumber?.replace(/\D/g, "") === userPhone.replace(/\D/g, "") &&
            userPhone.length > 0,
        );

        if (!alreadyExists) {
          fetchedList.unshift({
            id: "profile-self-contact",
            name: contactName,
            relationship: userRel,
            phoneNumber: userPhone,
            isPriority: fetchedList.length === 0,
            patientProfileId: targetPatientId,
          });
        }
      }

      setContacts(fetchedList);
    } catch (error) {
      console.error("Failed to fetch emergency contacts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      if (user?.role === "PATIENT") {
        router.replace("/patient/dashboard/settings");
      } else {
        router.replace("/nonpatient/dashboard/settings");
      }
    }
  };

  const handleCall = (phone: string) => {
    const cleaned = phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleaned}`).catch(() => {
      Alert.alert("Error", `Cannot place call to ${phone}`);
    });
  };

  const resetForm = () => {
    setName("");
    setRelationship("");
    setPhoneNumber("");
    setIsPriority(false);
    setEditingContact(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name || "");
    setRelationship(contact.relationship || "");
    setPhoneNumber(contact.phoneNumber || "");
    setIsPriority(contact.isPriority ?? false);
    setModalVisible(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalVisible(false);
    resetForm();
  };

  const handleSaveContact = async () => {
    const formattedName = capitalizeWords(name);
    const formattedRel = capitalizeWords(relationship);
    const trimmedPhone = phoneNumber.trim();

    if (!formattedName || !trimmedPhone) {
      Alert.alert(
        "Required Fields",
        "Please enter both Full Name and Phone Number.",
      );
      return;
    }

    if (!isValidPhilippinePhoneNumber(trimmedPhone)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid Philippine mobile number (e.g. +63 9XX XXX XXXX).",
      );
      return;
    }

    const relValue = formattedRel || "Emergency Contact";

    try {
      setSubmitting(true);

      if (editingContact && editingContact.id !== "profile-self-contact") {
        const payload = {
          id: editingContact.id,
          name: formattedName,
          relationship: relValue,
          phoneNumber: trimmedPhone,
          isPriority,
        };

        const response = await axiosInstance.put(
          "/api/emergency-contact/v1/update-emergency-contact",
          payload,
        );

        if (response.data?.status === "success" || response.data?.data) {
          await fetchContacts();
          setModalVisible(false);
          resetForm();
        }
      } else {
        // If we have an active patient ID, create in database
        if (activePatientProfileId) {
          const payload = {
            name: formattedName,
            relationship: relValue,
            phoneNumber: trimmedPhone,
            patientProfileId: activePatientProfileId,
            isPriority,
          };

          await axiosInstance.post(
            "/api/emergency-contact/v1/create-emergency-contact",
            payload,
          );
        }

        // Also update local user emergency contact profile if it's the user's primary contact
        if (user && (isPriority || !user.emergencyContact || editingContact?.id === "profile-self-contact")) {
          try {
            await axiosInstance.put("/api/user/v1/update-user", {
              email: user.email,
              emergencyContact: trimmedPhone,
            });
            await updateUser({
              ...user,
              emergencyContact: trimmedPhone,
              nonPatientProfile: user.nonPatientProfile
                ? { ...user.nonPatientProfile, relationship: relValue, emergencyContact: trimmedPhone }
                : null,
            });
          } catch (e) {
            console.log("Error syncing user profile emergency contact:", e);
          }
        }

        await fetchContacts();
        setModalVisible(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save emergency contact:", error);
      Alert.alert(
        "Error",
        editingContact
          ? "Unable to update emergency contact."
          : "Unable to save emergency contact.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = (contact: EmergencyContact) => {
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to remove ${contact.name} from emergency contacts?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (contact.id !== "profile-self-contact") {
                await axiosInstance.delete(
                  "/api/emergency-contact/v1/delete-emergency-contact",
                  { data: { id: contact.id } },
                );
              }
              setContacts((prev) => prev.filter((c) => c.id !== contact.id));
            } catch (error) {
              console.error("Failed to delete emergency contact:", error);
              Alert.alert("Error", "Unable to delete contact.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>Emergency Contacts</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add emergency contact"
          hitSlop={12}
          onPress={openAddModal}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={26} color="#0AA7A8" />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0AA7A8" />
          <Text style={styles.loadingText}>Loading emergency contacts...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0AA7A8"
            />
          }
        >
          {/* Emergency 911 Slide-to-Call */}
          <SlideToCall911 />

          <View style={styles.infoBanner}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#0AA7A8" style={{ marginTop: 2 }} />
            <Text style={styles.infoBannerText}>
              These designated emergency contacts will be contacted immediately when an urgent alert or SOS is triggered.
            </Text>
          </View>

          <View style={styles.listHeaderRow}>
            <Text style={styles.listSectionTitle}>
              {contacts.length} {contacts.length === 1 ? "Emergency Contact" : "Emergency Contacts"}
            </Text>
            <TouchableOpacity
              style={styles.addInlineBtn}
              onPress={openAddModal}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={16} color="#0AA7A8" />
              <Text style={styles.addInlineText}>Add Contact</Text>
            </TouchableOpacity>
          </View>

          {contacts.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="call-outline" size={40} color="#0AA7A8" />
              </View>
              <Text style={styles.emptyTitle}>No Emergency Contacts Added</Text>
              <Text style={styles.emptySubtitle}>
                Add trusted family members, doctors, or caregivers who should be called during an emergency.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={openAddModal}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.emptyAddButtonText}>Add Emergency Contact</Text>
              </TouchableOpacity>
            </View>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactHeaderRow}>
                  {/* Icon / Avatar */}
                  <View style={[styles.contactIconCircle, contact.isPriority && styles.priorityIconCircle]}>
                    <Ionicons
                      name={contact.isPriority ? "shield-checkmark" : "person"}
                      size={20}
                      color={contact.isPriority ? "#0AA7A8" : "#64748B"}
                    />
                  </View>

                  {/* Main Details: FULL NAME & RELATIONSHIP */}
                  <View style={styles.contactDetails}>
                    <View style={styles.nameRow}>
                      <Text style={styles.contactName} numberOfLines={1}>
                        {capitalizeWords(contact.name) || "Emergency Contact"}
                      </Text>
                      {contact.isPriority && (
                        <View style={styles.priorityTag}>
                          <Text style={styles.priorityTagText}>Priority</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.relationshipRow}>
                      <View style={styles.relationshipPill}>
                        <Text style={styles.contactRel}>{capitalizeWords(contact.relationship) || "Emergency Contact"}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Call Action Button */}
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Call ${contact.name}`}
                    onPress={() => handleCall(contact.phoneNumber)}
                    style={styles.callBtn}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Bottom Row: PHONE NUMBER & Action Buttons */}
                <View style={styles.contactBottomRow}>
                  <TouchableOpacity
                    style={styles.phoneContainer}
                    onPress={() => handleCall(contact.phoneNumber)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="call-outline" size={15} color="#0AA7A8" />
                    <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                  </TouchableOpacity>

                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${contact.name}`}
                      onPress={() => handleEditContact(contact)}
                      style={styles.editBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil" size={16} color="#0AA7A8" />
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${contact.name}`}
                      onPress={() => handleDeleteContact(contact)}
                      style={styles.deleteBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Add / Edit Contact Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
              </Text>
              <Pressable hitSlop={10} onPress={closeModal}>
                <Ionicons name="close" size={22} color="#64748B" />
              </Pressable>
            </View>

            {/* FULL NAME INPUT */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "name" && styles.inputFocused,
              ]}
              placeholder="e.g. Jane Doe or Dr. Emily Davis"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={(text) => setName(formatNameInput(text))}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              editable={!submitting}
              autoCapitalize="words"
            />

            {/* RELATIONSHIP INPUT */}
            <Text style={styles.inputLabel}>Relationship</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "relationship" && styles.inputFocused,
              ]}
              placeholder="e.g. Daughter, Spouse, Primary Doctor"
              placeholderTextColor="#94A3B8"
              value={relationship}
              onChangeText={(text) => setRelationship(formatNameInput(text))}
              onFocus={() => setFocusedField("relationship")}
              onBlur={() => setFocusedField(null)}
              editable={!submitting}
              autoCapitalize="words"
            />

            {/* PHONE NUMBER INPUT */}
            <Text style={styles.inputLabel}>Phone Number</Text>
            <PhoneInput
              placeholder="900 000 0000"
              value={phoneNumber}
              onChangeText={(formatted) => setPhoneNumber(formatted)}
              editable={!submitting}
              style={{ marginBottom: 4 }}
            />

            {/* Priority Switch Toggle */}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isPriority }}
              onPress={() => setIsPriority((prev) => !prev)}
              disabled={submitting}
              style={styles.priorityRow}
            >
              <View style={[styles.checkbox, isPriority && styles.checkboxSelected]}>
                {isPriority && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>

              <View style={styles.priorityTextContainer}>
                <Text style={styles.priorityTitle}>Primary Contact</Text>
                <Text style={styles.priorityDescription}>
                  Mark this person as the priority emergency contact.
                </Text>
              </View>
            </Pressable>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <Pressable onPress={closeModal} style={styles.cancelBtn} disabled={submitting}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable onPress={handleSaveContact} style={styles.saveBtn} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingContact ? "Update Contact" : "Save Contact"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  backgroundAccent: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 220,
    borderRadius: 130,
    backgroundColor: "#EDFBFB",
    opacity: 0.9,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EDFBFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B2EBF2",
    padding: 12,
    marginTop: 12,
    marginBottom: 18,
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#0E7490",
    lineHeight: 18,
  },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  listSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addInlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#EDFBFB",
    borderRadius: 10,
  },
  addInlineText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0AA7A8",
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  contactHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  priorityIconCircle: {
    backgroundColor: "#EDFBFB",
    borderWidth: 1.5,
    borderColor: "#0AA7A8",
  },
  contactDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  priorityTag: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  relationshipRow: {
    marginTop: 3,
  },
  relationshipPill: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  contactRel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    shadowColor: "#0AA7A8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  contactBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0AA7A8",
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#EDFBFB",
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0AA7A8",
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 28,
    alignItems: "center",
    marginTop: 10,
  },
  emptyIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#B2EBF2",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0AA7A8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  emptyAddButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 50,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
  },
  inputFocused: {
    borderColor: "#12A5B5",
    backgroundColor: "#FFFFFF",
    shadowColor: "#12A5B5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#0AA7A8",
    borderColor: "#0AA7A8",
  },
  priorityTextContainer: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  priorityDescription: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});