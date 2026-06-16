import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";

import { Recipe } from "../../types/Recipe";
import RecipeCard from "../../components/RecipeCard";
import PrimaryButton from "../../components/PrimaryButton";
import { getWishlist, markAsCooked, removeFromWishlist } from "../../services/storage";

export default function WishlistScreen() {
    const [wishlist, setWishlist] = useState<Recipe[]>([]);

    async function loadWishlist() {
        const data = await getWishlist();
        setWishlist(data);
    }

    async function handleMarkAsCooked(recipe: Recipe) {
        await markAsCooked(recipe);
        await loadWishlist();
    }

    async function handleRemove(recipeId: string) {
        await removeFromWishlist(recipeId);
        await loadWishlist();
    }

    useFocusEffect(
        useCallback(() => {
            loadWishlist();
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
                        <View style={styles.item}>
                            <RecipeCard
                                recipe={item}
                                onPress={() =>
                                    router.push(`/recipe/${item.id}`)
                                }
                            />
                            <View style={styles.buttonGroup}>
                                <PrimaryButton
                                    title="Gekocht"
                                    onPress={() => handleMarkAsCooked(item)}
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