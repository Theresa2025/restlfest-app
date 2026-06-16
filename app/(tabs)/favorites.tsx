import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";

import { Recipe } from "../../types/Recipe";
import RecipeCard from "../../components/RecipeCard";
import { getCookedRecipes, removeFromCooked, moveBackToWishlist, } from "../../services/storage";
import PrimaryButton from "../../components/PrimaryButton";

export default function FavoritesScreen() {
    const [cookedRecipes, setCookedRecipes] = useState<Recipe[]>([]);

    async function loadCookedRecipes() {
        const data = await getCookedRecipes();
        setCookedRecipes(data);
    }

    async function handleRemove(recipeId: string) {
        await removeFromCooked(recipeId);
        await loadCookedRecipes();
    }

    async function handleMoveBack(recipe: Recipe) {
        await moveBackToWishlist(recipe);
        await loadCookedRecipes();
    }

    useFocusEffect(
        useCallback(() => {
            loadCookedRecipes();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lieblingsrezepte</Text>
            <Text style={styles.subtitle}>
                Alle Rezepte, die du bereits gekocht hast.
            </Text>

            {cookedRecipes.length === 0 ? (
                <Text style={styles.emptyText}>
                    Noch keine gekochten Rezepte.
                </Text>
            ) : (
                <FlatList
                    data={cookedRecipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <RecipeCard
                                recipe={item}
                                onPress={() => router.push(`/recipe/${item.id}`)}
                            />

                            <View style={styles.buttonGroup}>
                                <PrimaryButton
                                    title="Zurück zur Wunschliste"
                                    onPress={() => handleMoveBack(item)}
                                />

                                <PrimaryButton
                                    title="Entfernen"
                                    onPress={() => handleRemove(item.id)}
                                />
                            </View>
                        </View>
                    )}
                />
            )}
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
    emptyText: {
        fontSize: 16,
        color: "#5E6C5B",
    },
    item: {
        marginBottom: 24,
    },

    buttonGroup: {
        marginTop: 10,
        gap: 10,
    },
});