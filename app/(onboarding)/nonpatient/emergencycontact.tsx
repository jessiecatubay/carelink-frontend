import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmergencyContactScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [relationship, setRelationship] = useState("");

    const handleContinue = () => {
        // Navigate to notification setup
        router.push("/(onboarding)/nonpatient/notificationsetup");
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                {/* Progress */}
                <View style={styles.paginationWrap}>
                    <PaginationDots currentIndex={5} total={8} />
                </View>

                {/* Centered Content */}
                <View style={styles.content}>
                    {/* Title */}
                    <Text style={styles.title}>Emergency Contact</Text>

                    {/* Description */}
                    <Text style={styles.subtitle}>
                        Who should be contacted in{"\n"}case of emergency?
                    </Text>

                    {/* Form Card */}
                    <View style={styles.card}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#8E8E93"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Relationship"
                            placeholderTextColor="#8E8E93"
                            value={relationship}
                            onChangeText={setRelationship}
                        />
                    </View>
                </View>

                {/* Continue Button */}
                <Button
                    title="Continue"
                    onPress={handleContinue}
                    style={styles.button}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingBottom: 30,
    },
    content: {
        flex: 1,
        justifyContent: "center",
    },
    paginationWrap: {
        marginTop: 100,
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "500",
        color: "#12A5B5",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        textAlign: "center",
        fontSize: 16,
        color: "#7A7A7A",
        lineHeight: 22,
        marginBottom: 40,
    },
    card: {
        alignSelf: "center",
        width: "100%",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#333333",
        backgroundColor: "#FFFFFF",
        paddingVertical: 32,
        paddingHorizontal: 20,
        gap: 20,
    },
    input: {
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "#7A7A7A",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        fontSize: 16,
        color: "#111111",
    },
    button: {
        width: "100%",
    },
});
