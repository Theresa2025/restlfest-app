import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";

import { Recipe } from "../../types/Recipe";
import RecipeCard from "../../components/RecipeCard";
import {
    getFavorites,
    removeFromFavorites,
} from "../../services/storage";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<Recipe[]>([]);

    async function loadFavorites() {
        const data = await getFavorites();
        setFavorites(data);
    }

    async function handleRemove(recipeId: string) {
        await removeFromFavorites(recipeId);
        await loadFavorites();
    }

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lieblingsrezepte</Text>

            <Text style={styles.subtitle}>
                Deine favorisierten Rezepte.
            </Text>

            {favorites.length === 0 ? (
                <Text style={styles.emptyText}>
                    Noch keine Lieblingsrezepte gespeichert.
                </Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecipeCard
                            recipe={item}
                            onPress={() => router.push(`/recipe/${item.id}`)}
                            onRemovePress={() => handleRemove(item.id)}
                            isFavorite={true}
                        />
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
});