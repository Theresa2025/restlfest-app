import { Text, Pressable, StyleSheet } from "react-native";

// Definiert die Eigenschaften (Props), die der Button von außen erhält.
type PrimaryButtonProps = {
    title: string; // Text, der auf dem Button angezeigt wird.
    onPress: () => void; // Funktion, die beim Klicken auf den Button ausgeführt wird.
};

// Wiederverwendbare Button-Komponente.
// Sie kann auf allen Screens verwendet werden und erhält Titel und Klickfunktion über Props.
export default function PrimaryButton({
                                          title,
                                          onPress,
                                      }: PrimaryButtonProps) {
    return (
        <Pressable
            // Führt die übergebene Funktion aus, sobald der Button gedrückt wird.
            onPress={onPress}

            // Während der Button gedrückt wird, wird zusätzlich der Style
            // "buttonPressed" angewendet.
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            {/* Gibt den übergebenen Button-Text aus */}
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3A7D44",
        paddingVertical: 15,
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },

    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },

    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});