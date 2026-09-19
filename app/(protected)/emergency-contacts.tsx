import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Contact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
};

const DEFAULT_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Dr. Sarah Jenkins",
    relationship: "Primary Physician",
    phone: "+1 (555) 234-5678",
    isPrimary: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    relationship: "Family / Son",
    phone: "+1 (555) 987-6543",
  },
  {
    id: "3",
    name: "CareLink Emergency Response",
    relationship: "24/7 Dispatch",
    phone: "911",
    isPrimary: true,
  },
];

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");

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

  const handleCall = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleaned}`).catch(() => {
      Alert.alert("Error", `Cannot place call to ${phoneNumber}`);
    });
  };

  const handleAddContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Required Fields", "Please enter contact name and phone number.");
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      relationship: relationship.trim() || "Emergency Contact",
      phone: phone.trim(),
    };

    setContacts((prev) => [newContact, ...prev]);
    setName("");
    setRelationship("");
    setPhone("");
    setModalVisible(false);
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert("Delete Contact", "Are you sure you want to remove this emergency contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setContacts((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionSubtitle}>
          These contacts will be notified immediately when an emergency SOS alert is triggered.
        </Text>

        {contacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <Ionicons
                name={contact.isPrimary ? "shield-checkmark" : "person"}
                size={22}
                color={contact.isPrimary ? "#0AA7A8" : "#64748B"}
              />
            </View>

            <View style={styles.contactDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.contactName}>{contact.name}</Text>
                {contact.isPrimary && (
                  <View style={styles.primaryTag}>
                    <Text style={styles.primaryTagText}>Priority</Text>
                  </View>
                )}
              </View>
              <Text style={styles.contactRel}>{contact.relationship}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => handleCall(contact.phone)}
                style={styles.callBtn}
              >
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </Pressable>
              {!contact.isPrimary && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleDeleteContact(contact.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </Pressable>
              )}
            </View>
          </View>
        ))}

        <Pressable
          accessibilityRole="button"
          onPress={() => setModalVisible(true)}
          style={styles.addContactRow}
        >
          <Ionicons name="add-circle-outline" size={22} color="#0AA7A8" />
          <Text style={styles.addContactText}>Add New Emergency Contact</Text>
        </Pressable>
      </ScrollView>

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
              placeholder="e.g. +1 (555) 000-0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleAddContact}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnText}>Save Contact</Text>
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
