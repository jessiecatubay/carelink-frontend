import Button from "@/components/ui/Button";
import PaginationDots from "@/components/ui/PaginationDots";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationSetupScreen() {
    const router = useRouter();

    const handleEnable = () => {
        // Navigate to setup complete
        router.push("/(onboarding)/nonpatient/setupcomplete");
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                {/* Progress */}
                <View style={styles.paginationWrap}>
                    <PaginationDots currentIndex={6} total={8} />
                </View>

                {/* Centered Content */}
                <View style={styles.content}>
                    {/* Title */}
                    <Text style={styles.title}>Notifications Setup</Text>

                    {/* Description */}
                    <Text style={styles.subtitle}>
                        Never miss a critical moment.
                    </Text>

                    {/* Card */}
                    <View style={styles.card}>
                        <Image
                            source={require("@/assets/icons/bell.png")}
                            style={styles.bellIcon}
                            resizeMode="contain"
                        />

                        <Text style={styles.cardTitle}>Stay Alerted</Text>

                        <Text style={styles.cardText}>
                            Get notified instantly when the patient needs help
                        </Text>
                    </View>
                </View>

                {/* Action Button */}
                <Button
                    title="Enable Notifications"
                    onPress={handleEnable}
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
        alignItems: "center",
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
        paddingVertical: 40,
        paddingHorizontal: 30,
        alignItems: "center",
    },
    bellIcon: {
        width: 60,
        height: 60,
        marginBottom: 20,
        tintColor: "#12A5B5",
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#F16A66",
        textAlign: "center",
        marginBottom: 12,
    },
    cardText: {
        fontSize: 16,
        color: "#7A7A7A",
        textAlign: "center",
        lineHeight: 22,
    },
    button: {
        width: "100%",
    },
});
