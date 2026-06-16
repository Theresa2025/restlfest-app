import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { mockRecipes } from "../../data/mockRecipes";
import RecipeCard from "../../components/RecipeCard";
import PrimaryButton from "../../components/PrimaryButton";
import { addToWishlist } from "../../services/storage";
import { Recipe } from "../../types/Recipe";
import { fetchRecipesByIngredient } from "../../services/recipeApi";

export default function DiscoverScreen() {
    const params = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);

    const selectedIngredients =
        typeof params.ingredients === "string"
            ? params.ingredients
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter((item) => item.length > 0)
            : [];

    useEffect(() => {
        async function loadApiRecipes() {
            if (selectedIngredients.length === 0) {
                return;
            }

            setLoading(true);

            const recipesFromApi = await fetchRecipesByIngredient(
                selectedIngredients[0]
            );

            setApiRecipes(recipesFromApi);
            setCurrentIndex(0);
            setLoading(false);
        }

        loadApiRecipes();
    }, [params.ingredients]);

    const filteredRecipes =
        apiRecipes.length > 0
            ? apiRecipes
            : selectedIngredients.length === 0
                ? mockRecipes
                : mockRecipes.filter((recipe) =>
                    recipe.ingredients.some((ingredient) =>
                        selectedIngredients.includes(ingredient.toLowerCase())
                    )
                );

    const currentRecipe = filteredRecipes[currentIndex];

    function nextRecipe() {
        setCurrentIndex((current) => current + 1);
    }

    async function saveRecipe() {
        if (!currentRecipe) return;

        await addToWishlist(currentRecipe);
        nextRecipe();
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Rezepte laden...</Text>
            </View>
        );
    }

    if (!currentRecipe) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Rezepte entdecken</Text>
                <Text style={styles.emptyText}>
                    Keine weiteren Rezepte vorhanden.
                </Text>

                <PrimaryButton
                    title="Zur Wunschliste"
                    onPress={() => router.push("/(tabs)/wishlist")}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rezepte entdecken</Text>

            <Text style={styles.subtitle}>
                {selectedIngredients.length === 0
                    ? "Swipe dich durch alle Rezeptvorschläge."
                    : `Passend zu: ${selectedIngredients.join(", ")}`}
            </Text>

            <RecipeCard
                recipe={currentRecipe}
                onPress={() => router.push(`/recipe/${currentRecipe.id}`)}
            />

            <View style={styles.buttonRow}>
                <PrimaryButton
                    title="Verwerfen"
                    onPress={nextRecipe}
                />

                <PrimaryButton
                    title="Speichern"
                    onPress={saveRecipe}
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
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#5E6C5B",
        marginBottom: 24,
    },
    buttonRow: {
        marginTop: 20,
        gap: 12,
    },
});