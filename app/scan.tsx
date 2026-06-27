import { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";

export default function ScanScreen() {

    // Referenz auf die Kamera, damit später Funktionen wie takePictureAsync()
    // direkt aufgerufen werden können.
    const cameraRef = useRef<CameraView>(null);

    // Hook von Expo Camera:
    // permission enthält den aktuellen Berechtigungsstatus.
    // requestPermission() öffnet den Dialog zur Kamerafreigabe.
    const [permission, requestPermission] = useCameraPermissions();

    // Solange der Berechtigungsstatus noch geladen wird,
    // wird lediglich ein leerer Container angezeigt.
    if (!permission) {
        return <View style={styles.container} />;
    }

    // Falls die Kamera noch nicht freigegeben wurde,
    // wird eine Information mit einem Button angezeigt.
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

    // Wird beim Klick auf "Foto aufnehmen" ausgeführt.
    async function takePicture() {

        // Foto wird mit der Expo Camera aufgenommen.
        const photo = await cameraRef.current?.takePictureAsync();

        // Ausgabe der Bild-URI in der Konsole (nur zu Testzwecken).
        console.log("Foto aufgenommen:", photo?.uri);

        // Da aktuell keine Bilderkennung eingebunden ist,
        // werden zufällige Zutaten simuliert.
        // Anschließend Navigation zum Ingredients-Screen.
        router.push({
            pathname: "/ingredients",
            params: {
                detected: getRandomDetectedIngredients(),
            },
        });
    }

    // Simuliert eine Bilderkennung.
    // Bei einer echten Vision-API würden hier erkannte Zutaten zurückgegeben werden.
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

        // Zufälligen Datensatz auswählen.
        const randomIndex = Math.floor(
            Math.random() * scanResults.length
        );

        return scanResults[randomIndex];
    }

    // Hauptansicht des Screens.
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