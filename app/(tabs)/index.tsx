import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🥗</Text>
            <Text style={styles.title}>RestlFest</Text>
            <Text style={styles.subtitle}>
                Finde Rezepte aus deinen Lebensmitteln.
            </Text>

            <PrimaryButton
                title="Lebensmittel scannen"
                onPress={() => router.push("/scan")}
            />

            <PrimaryButton
                title="Zutaten bearbeiten"
                onPress={() => router.push("/ingredients")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 18,
        backgroundColor: "#F7F4EA",
    },
    logo: {
        fontSize: 64,
        textAlign: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        color: "#263A29",
    },
    subtitle: {
        fontSize: 17,
        textAlign: "center",
        color: "#5E6C5B",
        marginBottom: 16,
    },
});