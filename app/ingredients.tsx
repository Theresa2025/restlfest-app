import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Pressable,
} from "react-native";

import PrimaryButton from "../components/PrimaryButton";

export default function IngredientsScreen() {
    const params = useLocalSearchParams();
    const [ingredientInput, setIngredientInput] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([]);

    useEffect(() => {
        if (
            typeof params.detected === "string" &&
            params.detected.length > 0
        ) {
            const scannedIngredients = params.detected
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length > 0);

            setIngredients(scannedIngredients);
        }
    }, [params.detected]);

    function addIngredient() {
        const cleanedIngredient = ingredientInput.trim();

        if (cleanedIngredient.length === 0) {
            return;
        }

        if (ingredients.includes(cleanedIngredient)) {
            setIngredientInput("");
            return;
        }

        setIngredients([...ingredients, cleanedIngredient]);
        setIngredientInput("");
    }

    function removeIngredient(ingredientToRemove: string) {
        setIngredients(
            ingredients.filter(
                (ingredient) => ingredient !== ingredientToRemove
            )
        );
    }

    function searchRecipes() {
        router.push({
            pathname: "/(tabs)/discover",
            params: {
                ingredients: ingredients.join(","),
            },
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zutaten bearbeiten</Text>

            <Text style={styles.subtitle}>
                Prüfe die erkannten Lebensmittel und ergänze fehlende Zutaten.
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Neue Zutat hinzufügen</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="z.B. Tomaten"
                        value={ingredientInput}
                        onChangeText={setIngredientInput}
                        onSubmitEditing={addIngredient}
                    />

                    <Pressable style={styles.addButton} onPress={addIngredient}>
                        <Text style={styles.addButtonText}>+</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={styles.sectionTitle}>
                Erkannte Zutaten ({ingredients.length})
            </Text>

            {ingredients.length === 0 ? (
                <Text style={styles.emptyText}>
                    Noch keine Zutaten vorhanden.
                </Text>
            ) : (
                <FlatList
                    data={ingredients}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.ingredientChip}>
                            <Text style={styles.ingredientIcon}>🥕</Text>

                            <Text style={styles.ingredientText}>{item}</Text>

                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => removeIngredient(item)}
                            >
                                <Text style={styles.deleteText}>×</Text>
                            </Pressable>
                        </View>
                    )}
                />
            )}

            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Rezepte suchen"
                    onPress={searchRecipes}
                />
            </View>
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

    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#263A29",
        marginBottom: 12,
    },

    inputRow: {
        flexDirection: "row",
        gap: 10,
    },

    input: {
        flex: 1,
        backgroundColor: "#F7F4EA",
        borderRadius: 14,
        padding: 14,
        fontSize: 16,
        color: "#263A29",
    },

    addButton: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: "#3A7D44",
        justifyContent: "center",
        alignItems: "center",
    },

    addButtonText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#263A29",
        marginBottom: 14,
    },

    listContent: {
        paddingBottom: 16,
    },

    ingredientChip: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    ingredientIcon: {
        fontSize: 22,
        marginRight: 12,
    },

    ingredientText: {
        flex: 1,
        fontSize: 17,
        fontWeight: "600",
        color: "#263A29",
    },

    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FDECEC",
        justifyContent: "center",
        alignItems: "center",
    },

    deleteText: {
        color: "#B00020",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 24,
    },

    emptyText: {
        fontSize: 16,
        color: "#5E6C5B",
    },

    buttonContainer: {
        marginTop: 20,
    },
});