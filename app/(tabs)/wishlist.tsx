import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Recipe } from "../../types/Recipe";
import RecipeCard from "../../components/RecipeCard";
import { getWishlist, removeFromWishlist, addToFavorites, getFavorites,
    removeFromFavorites } from "../../services/storage";

export default function WishlistScreen() {

    // State für alle gespeicherten Rezepte der Wunschliste
    const [wishlist, setWishlist] = useState<Recipe[]>([]);

    // Speichert nur die IDs der Lieblingsrezepte
    // Dadurch kann schnell überprüft werden,
    // ob ein Rezept bereits als Favorit markiert wurde.
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    // Lädt Wunschliste und Favoriten aus dem AsyncStorage
    async function loadData() {
        const wishlistData = await getWishlist();
        const favoritesData = await getFavorites();

        // Aktualisiert den State
        setWishlist(wishlistData);

        // Es werden nur die IDs gespeichert,
        // damit die Abfrage einfacher und schneller ist.
        setFavoriteIds(favoritesData.map((item) => item.id));
    }

    // Rezept zu den Favoriten hinzufügen oder wieder entfernen
    async function handleFavorite(recipe: Recipe) {
        const isAlreadyFavorite = favoriteIds.includes(recipe.id);

        if (isAlreadyFavorite) {
            await removeFromFavorites(recipe.id);
        } else {
            await addToFavorites(recipe);
        }

        // Nach jeder Änderung die Daten neu laden
        await loadData();
    }

    // Rezept aus der Wunschliste löschen
    async function handleRemove(recipeId: string) {
        await removeFromWishlist(recipeId);
        await loadData();
    }

    // useFocusEffect wird jedes Mal ausgeführt,
    // wenn der Screen wieder geöffnet wird.
    // Dadurch sind Wunschliste und Favoriten
    // immer auf dem aktuellen Stand.
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

                            // Öffnet die Detailansicht
                            onPress={() => router.push(`/recipe/${item.id}`)}

                            // Favoriten umschalten
                            onFavoritePress={() => handleFavorite(item)}

                            // Rezept aus Wunschliste entfernen
                            onRemovePress={() => handleRemove(item.id)}

                            // Herz rot anzeigen, wenn Favorit
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