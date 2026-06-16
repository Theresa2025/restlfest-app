import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

import PrimaryButton from "../components/PrimaryButton";

export default function ScanScreen() {
    function fakeScan() {
        router.push({
            pathname: "/ingredients",
            params: {
                detected: "Tomaten,Mozzarella,Nudeln",
            },
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lebensmittel scannen</Text>
            <Text style={styles.subtitle}>
                Hier wird später die Kamera eingebaut.
            </Text>

            <View style={styles.scanBox}>
                <Text style={styles.scanText}>📷 Kamera Vorschau</Text>
            </View>

            <PrimaryButton
                title="Fake Scan starten"
                onPress={fakeScan}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#F7F4EA",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#263A29",
    },
    subtitle: {
        fontSize: 16,
        color: "#5E6C5B",
        marginTop: 8,
        marginBottom: 24,
    },
    scanBox: {
        height: 320,
        backgroundColor: "#fff",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    scanText: {
        fontSize: 20,
        color: "#5E6C5B",
    },
});