import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { mockRecipes } from "../../data/mockRecipes";
import PrimaryButton from "../../components/PrimaryButton";
import { addToWishlist } from "../../services/storage";

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();

    const recipe = mockRecipes.find((item) => item.id === id);

    if (!recipe) {
        return (
            <View style={styles.container}>
                <Text>Rezept nicht gefunden.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: recipe.imageUrl }}
                style={styles.image}
            />

            <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>

                <Text style={styles.duration}>
                    ⏱ {recipe.duration} Minuten
                </Text>

                <Text style={styles.sectionTitle}>Zutaten</Text>

                {recipe.ingredients.map((ingredient) => (
                    <Text key={ingredient} style={styles.ingredient}>
                        • {ingredient}
                    </Text>
                ))}

                <Text style={styles.sectionTitle}>Zubereitung</Text>

                {recipe.instructions.map((step, index) => (
                    <Text key={index} style={styles.instruction}>
                        {index + 1}. {step}
                    </Text>
                ))}

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title="Zur Wunschliste hinzufügen"
                        onPress={async () => {
                            await addToWishlist(recipe);

                            Alert.alert(
                                "Gespeichert",
                                "Rezept wurde zur Wunschliste hinzugefügt."
                            );

                            router.push("/(tabs)/wishlist");
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F4EA",
    },

    image: {
        width: "100%",
        height: 260,
    },

    content: {
        padding: 24,
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#263A29",
    },

    duration: {
        marginTop: 10,
        fontSize: 16,
        color: "#3A7D44",
        fontWeight: "600",
    },

    sectionTitle: {
        marginTop: 28,
        marginBottom: 14,
        fontSize: 22,
        fontWeight: "bold",
        color: "#263A29",
    },

    ingredient: {
        fontSize: 17,
        marginBottom: 10,
        color: "#5E6C5B",
    },

    instruction: {
        fontSize: 16,
        color: "#263A29",
        marginBottom: 8,
        lineHeight: 24,
    },

    buttonContainer: {
        marginTop: 32,
    },
});