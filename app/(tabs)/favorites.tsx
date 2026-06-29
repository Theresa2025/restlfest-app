import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Recipe } from "../../types/Recipe";
import RecipeCard from "../../components/RecipeCard";
import { getFavorites, removeFromFavorites } from "../../services/storage";

export default function FavoritesScreen() {
    // State speichert alle aktuell geladenen Lieblingsrezepte
    const [favorites, setFavorites] = useState<Recipe[]>([]);

    // Lädt die gespeicherten Lieblingsrezepte aus dem AsyncStorage
    async function loadFavorites() {
        const data = await getFavorites();
        setFavorites(data);
    }

    // Entfernt ein Rezept aus den Favoriten
    // Anschließend wird die Liste neu geladen, damit die UI aktualisiert wird
    async function handleRemove(recipeId: string) {
        await removeFromFavorites(recipeId);
        await loadFavorites();
    }

    // useFocusEffect wird jedes Mal ausgeführt,
    // wenn dieser Screen wieder in den Vordergrund kommt.
    // Dadurch werden Änderungen sofort angezeigt.
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

                // FlatList zeigt alle Lieblingsrezepte performant an
                <FlatList
                    data={favorites}

                    // Jedes Rezept besitzt eine eindeutige ID
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecipeCard
                            // Übergibt das aktuelle Rezept an die Karte
                            recipe={item}

                            // Öffnet beim Antippen die Detailansicht
                            onPress={() => router.push(`/recipe/${item.id}`)}

                            // Entfernt das Rezept aus den Favoriten
                            onRemovePress={() => handleRemove(item.id)}

                            // Herzsymbol wird rot dargestellt
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
        paddingTop: 40,
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