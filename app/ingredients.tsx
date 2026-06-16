import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from "react-native";
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
                .map((item) => item.trim());

            setIngredients(scannedIngredients);
        }
    }, [params.detected]);

    function addIngredient() {
        const cleanedIngredient = ingredientInput.trim();

        if (cleanedIngredient.length === 0) {
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
                Gib ein, welche Lebensmittel du zuhause hast.
            </Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="z.B. Tomaten"
                    value={ingredientInput}
                    onChangeText={setIngredientInput}
                />

                <Pressable style={styles.addButton} onPress={addIngredient}>
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>

            <FlatList
                data={ingredients}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.ingredientItem}>
                        <Text style={styles.ingredientText}>{item}</Text>

                        <Pressable onPress={() => removeIngredient(item)}>
                            <Text style={styles.deleteText}>Entfernen</Text>
                        </Pressable>
                    </View>
                )}
            />

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
    inputRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 24,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        fontSize: 16,
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
    ingredientItem: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ingredientText: {
        fontSize: 16,
        color: "#263A29",
    },
    deleteText: {
        color: "#B00020",
        fontWeight: "bold",
    },
    buttonContainer: {
        marginTop: 20,
    },
});