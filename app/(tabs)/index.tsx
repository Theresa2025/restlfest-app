import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "../../components/PrimaryButton";
import { Image } from "react-native";

const heroImage = require("../../assets/images/home-hero.png");

export default function HomeScreen() {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>RestlFest</Text>

            <Text style={styles.subtitle}>
                Erkenne deine Lebensmittel{"\n"}
                Entdecke passende Rezepte.
            </Text>

            <Image
                source={heroImage}
                style={styles.heroImage}
                resizeMode="cover"
            />

            <View style={styles.buttonGroup}>
                <PrimaryButton
                    title="Lebensmittel scannen"
                    onPress={() => router.push("/scan")}
                />

                <PrimaryButton
                    title="Zutaten bearbeiten"
                    onPress={() => router.push("/ingredients")}
                />
            </View>

        </View>
    );}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F4EA",
        paddingHorizontal: 24,
        paddingTop: 55,
        alignItems: "center",
    },

    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#3A7D44",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 18,
        color: "#6C756B",
        textAlign: "center",
        lineHeight: 26,
        marginBottom: 30,
    },

    heroImage: {
        width: 230,
        height: 230,
        borderRadius: 115,
        marginBottom: 40,

        borderWidth: 5,
        borderColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 6,
    },

    buttonGroup: {
        width: "100%",
        gap: 16,
    },
});