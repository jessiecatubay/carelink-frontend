import LogoutConfirmModal from "@/components/ui/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LogoutButton() {
  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmLogout = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => setModalVisible(true)}
        disabled={loading}
      >
        <Text style={styles.text}>Log out</Text>
      </Pressable>

      <LogoutConfirmModal
        visible={modalVisible}
        loading={loading}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
