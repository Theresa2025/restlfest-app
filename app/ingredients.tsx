import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { router } from "expo-router";

type Ingredient = {
    id: string;
    name: string;
};

export default function IngredientsScreen() {
    const [ingredientName, setIngredientName] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: "1", name: "Tomaten" },
        { id: "2", name: "Nudeln" },
        { id: "3", name: "Mozzarella" },
    ]);

    const addIngredient = () => {
        if (ingredientName.trim().length === 0) return;

        const newIngredient = {
            id: Date.now().toString(),
            name: ingredientName.trim(),
        };

        setIngredients((currentIngredients) => [
            newIngredient,
            ...currentIngredients,
        ]);

        setIngredientName("");
    };

    const deleteIngredient = (id: string) => {
        setIngredients((currentIngredients) =>
            currentIngredients.filter((ingredient) => ingredient.id !== id)
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Zutaten bearbeiten</Text>
            <Text style={styles.subtitle}>
                Korrigiere erkannte Lebensmittel oder füge neue hinzu.
            </Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="z. B. Paprika"
                    value={ingredientName}
                    onChangeText={setIngredientName}
                />

                <Pressable style={styles.addButton} onPress={addIngredient}>
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>

            <FlatList
                data={ingredients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.ingredientItem}>
                        <Text style={styles.ingredientText}>{item.name}</Text>

                        <Pressable onPress={() => deleteIngredient(item.id)}>
                            <Text style={styles.deleteText}>Löschen</Text>
                        </Pressable>
                    </View>
                )}
            />

            <PrimaryButton
                title="Rezepte suchen"
                onPress={() => router.push("/discover")}
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
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    addButton: {
        width: 48,
        borderRadius: 12,
        backgroundColor: "#3A7D44",
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },
    ingredientItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ingredientText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#263A29",
    },
    deleteText: {
        color: "#B23B3B",
        fontWeight: "bold",
    },
});