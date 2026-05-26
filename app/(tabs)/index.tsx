import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>RestlFest</Text>

            <Text style={styles.subtitle}>
                Finde Rezepte aus deinen Lebensmitteln.
            </Text>

            <Button
                title="Lebensmittel scannen"
                onPress={() => router.push("/scan")}
            />

            <Button
                title="Zutaten bearbeiten"
                onPress={() => router.push("/ingredients")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 20,
    },

    title: {
        fontSize: 34,
        fontWeight: "bold",
    },

    subtitle: {
        fontSize: 18,
    },
});