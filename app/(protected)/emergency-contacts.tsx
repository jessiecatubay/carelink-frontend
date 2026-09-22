import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/hooks/lib/axios";
import { PatientProfile } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  isPriority?: boolean;
  patientProfileId: string;
};

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [patientProfileId, setPatientProfileId] = useState<PatientProfile>();

  const fetchContacts = async () => {
    try {
      const result = await axiosInstance.post(
        "/api/patient-nonpatient/v1/connected-patients",
        {
          nonPatientId: user?.id,
        },
      );
      console.log("fasdfawef 23qrfasdcv23", result.data.data[0].patient.id);

      setPatientProfileId(result.data.data[0].patient.id);

      if (!patientProfileId) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await axiosInstance.post(
        "/api/emergency-contact/v1/emergency-contacts/patient",
        { patientProfileId: patientProfileId },
      );

      if (response.data?.status === "success" || response.data?.data) {
        setContacts(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch emergency contacts:", error);
      Alert.alert("Error", "Unable to load emergency contacts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [patientProfileId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      if (user?.role === "PATIENT") {
        router.replace("/(protected)/(patient)/settings");
      } else {
        router.replace("/(protected)/(non-patient)/settings");
      }
    }
  };

  const handleCall = (phone: string) => {
    const cleaned = phone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleaned}`).catch(() => {
      Alert.alert("Error", `Cannot place call to ${phone}`);
    });
  };

  const handleAddContact = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      Alert.alert(
        "Required Fields",
        "Please enter contact name and phone number.",
      );
      return;
    }

    if (!patientProfileId) {
      Alert.alert("Error", "Patient profile ID not found.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        relationship: relationship.trim() || "Emergency Contact",
        phoneNumber: phoneNumber.trim(),
        patientProfileId: patientProfileId,
      };

      const response = await axiosInstance.post(
        "/api/emergency-contact/v1/create-emergency-contact",
        payload,
      );

      if (response.data?.status === "success" || response.data?.data) {
        await fetchContacts();
        setName("");
        setRelationship("");
        setPhoneNumber("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Failed to create emergency contact:", error);
      Alert.alert("Error", "Unable to save emergency contact.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to remove this emergency contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axiosInstance.delete(
                "/api/emergency-contact/v1/delete-emergency-contact",
                { data: { id } },
              );

              if (
                response.data?.status === "success" ||
                response.status === 200
              ) {
                setContacts((prev) => prev.filter((c) => c.id !== id));
              }
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
      {/* Curved Background Accent */}
      <View style={styles.backgroundAccent} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#0AA7A8" />
        </Pressable>

        <Text style={styles.headerTitle}>Emergency Contacts</Text>

        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
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
          <Text style={styles.sectionSubtitle}>
            These contacts will be notified immediately when an emergency SOS
            alert is triggered.
          </Text>

          {contacts.length === 0 ? (
            <Text style={styles.emptyText}>
              No emergency contacts added yet.
            </Text>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactIcon}>
                  <Ionicons
                    name={contact.isPriority ? "shield-checkmark" : "person"}
                    size={22}
                    color={contact.isPriority ? "#0AA7A8" : "#64748B"}
                  />
                </View>

                <View style={styles.contactDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.isPriority && (
                      <View style={styles.primaryTag}>
                        <Text style={styles.primaryTagText}>Priority</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.contactRel}>{contact.relationship}</Text>
                  <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleCall(contact.phoneNumber)}
                    style={styles.callBtn}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                  </Pressable>
                  {!contact.isPriority && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleDeleteContact(contact.id)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            ))
          )}

          <Pressable
            accessibilityRole="button"
            onPress={() => setModalVisible(true)}
            style={styles.addContactRow}
          >
            <Ionicons name="add-circle-outline" size={22} color="#0AA7A8" />
            <Text style={styles.addContactText}>Add New Emergency Contact</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Add Contact Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Emily Davis"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Relationship</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Cardiologist, Daughter"
              placeholderTextColor="#94A3B8"
              value={relationship}
              onChangeText={setRelationship}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +63 912 345 6789"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleAddContact}
                style={styles.saveBtn}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Contact</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E242B",
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginVertical: 20,
    fontSize: 14,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EDFBFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  contactDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  primaryTag: {
    backgroundColor: "#EDFBFB",
    borderColor: "#0AA7A8",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  primaryTagText: {
    color: "#0AA7A8",
    fontSize: 9,
    fontWeight: "700",
  },
  contactRel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: "#0AA7A8",
    fontWeight: "500",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0AA7A8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  addContactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#0AA7A8",
    backgroundColor: "#F8FAFC",
  },
  addContactText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#0AA7A8",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  saveBtn: {
    backgroundColor: "#0AA7A8",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
