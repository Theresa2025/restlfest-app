import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";

import { Recipe } from "../../types/Recipe";
import RecipeCard from "../../components/RecipeCard";
import {
    getWishlist,
    removeFromWishlist,
    addToFavorites,
    getFavorites,
    removeFromFavorites
} from "../../services/storage";

export default function WishlistScreen() {
    const [wishlist, setWishlist] = useState<Recipe[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    async function loadData() {
        const wishlistData = await getWishlist();
        const favoritesData = await getFavorites();

        setWishlist(wishlistData);
        setFavoriteIds(favoritesData.map((item) => item.id));
    }

    async function handleFavorite(recipe: Recipe) {
        const isAlreadyFavorite = favoriteIds.includes(recipe.id);

        if (isAlreadyFavorite) {
            await removeFromFavorites(recipe.id);
        } else {
            await addToFavorites(recipe);
        }

        await loadData();
    }

    async function handleRemove(recipeId: string) {
        await removeFromWishlist(recipeId);
        await loadData();
    }

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wunschliste</Text>

            <Text style={styles.subtitle}>
                Deine gespeicherten Rezepte, die du noch kochen möchtest.
            </Text>

            {wishlist.length === 0 ? (
                <Text style={styles.emptyText}>
                    Noch keine Rezepte gespeichert.
                </Text>
            ) : (
                <FlatList
                    data={wishlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecipeCard
                            recipe={item}
                            onPress={() => router.push(`/recipe/${item.id}`)}
                            onFavoritePress={() => handleFavorite(item)}
                            onRemovePress={() => handleRemove(item.id)}
                            isFavorite={favoriteIds.includes(item.id)}
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