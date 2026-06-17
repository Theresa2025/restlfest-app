import { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

import PrimaryButton from "../components/PrimaryButton";

export default function ScanScreen() {
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Kamera Zugriff</Text>

                <Text style={styles.subtitle}>
                    Wir brauchen Zugriff auf deine Kamera, um Lebensmittel zu scannen.
                </Text>

                <PrimaryButton
                    title="Kamera erlauben"
                    onPress={requestPermission}
                />
            </View>
        );
    }

    async function takePicture() {
        const photo = await cameraRef.current?.takePictureAsync();

        console.log("Foto aufgenommen:", photo?.uri);

        router.push({
            pathname: "/ingredients",
            params: {
                detected: getRandomDetectedIngredients(),
            },
        });
    }

    function getRandomDetectedIngredients() {
        const scanResults = [
            "Tomaten,Mozzarella,Nudeln",
            "Kartoffeln,Eier,Zwiebel",
            "Reis,Paprika,Zucchini",
            "Salat,Gurke,Feta",
            "Hähnchen,Reis,Paprika",
            "Tomaten,Käse,Brot",
            "Karotten,Kartoffeln,Zwiebel",
            "Mais,Bohnen,Reis",
        ];

        const randomIndex = Math.floor(
            Math.random() * scanResults.length
        );

        return scanResults[randomIndex];
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lebensmittel scannen</Text>

            <Text style={styles.subtitle}>
                Fotografiere deine Lebensmittel. Die Erkennung wird aktuell simuliert.
            </Text>

            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
            />

            <PrimaryButton
                title="Foto aufnehmen"
                onPress={takePicture}
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

    camera: {
        height: 360,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 24,
    },
});