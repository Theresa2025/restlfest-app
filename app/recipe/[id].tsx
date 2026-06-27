import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert, Pressable, } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Recipe } from "../../types/Recipe";
import { mockRecipes } from "../../data/mockRecipes";
import PrimaryButton from "../../components/PrimaryButton";
import { addToWishlist, removeFromWishlist, getWishlist, addToFavorites, removeFromFavorites,
    getFavorites, getSelectedRecipe } from "../../services/storage";
import { fetchRecipeDetailsById } from "../../services/recipeApi";

export default function RecipeDetailScreen() {
    // ID aus der Route lesen, z.B. /recipe/12345
    const { id } = useLocalSearchParams();

    // Aktiver Tab: Zutaten, Schritte oder Infos
    const [activeTab, setActiveTab] =
        useState<"ingredients" | "steps" | "infos">("ingredients");

    // Aktuell angezeigtes Rezept.
    // Am Anfang null, weil es zuerst geladen werden muss.
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

    // Status für Wunschliste und Favoriten.
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Lädt das passende Rezept anhand der ID.
    useEffect(() => {
        async function loadRecipe() {
            const recipeId = String(id);

            // 1. Zuerst in lokalen Mock-Rezepten suchen.
            const mockRecipe = mockRecipes.find(
                (item) => item.id === recipeId
            );

            if (mockRecipe) {
                setCurrentRecipe(mockRecipe);
                return;
            }

            // 2. Falls es kein Mock-Rezept ist:
            // Detaildaten von der externen Rezept-API laden.
            const apiRecipe = await fetchRecipeDetailsById(recipeId);

            if (apiRecipe) {
                setCurrentRecipe(apiRecipe);
                return;
            }

            // 3. Falls das Rezept vorher im Discover-Screen ausgewählt wurde,
            // wird es aus dem lokalen Zwischenspeicher geladen.
            const selectedRecipe = await getSelectedRecipe();

            if (selectedRecipe && selectedRecipe.id === recipeId) {
                setCurrentRecipe(selectedRecipe);
                return;
            }

            // 4. Falls das Rezept in der Wunschliste gespeichert ist.
            const wishlist = await getWishlist();
            const wishlistRecipe = wishlist.find(
                (item) => item.id === recipeId
            );

            if (wishlistRecipe) {
                setCurrentRecipe(wishlistRecipe);
                return;
            }

            // 5. Falls das Rezept in den Favoriten gespeichert ist.
            const favorites = await getFavorites();
            const favoriteRecipe = favorites.find(
                (item) => item.id === recipeId
            );

            if (favoriteRecipe) {
                setCurrentRecipe(favoriteRecipe);
            }
        }

        loadRecipe();
    }, [id]);

    // Prüft, ob das aktuelle Rezept bereits in Wunschliste oder Favoriten liegt.
    async function loadStatus(recipe: Recipe) {
        const wishlist = await getWishlist();
        const favorites = await getFavorites();

        setIsInWishlist(
            wishlist.some((item) => item.id === recipe.id)
        );

        setIsFavorite(
            favorites.some((item) => item.id === recipe.id)
        );
    }

    // Wird jedes Mal ausgeführt, wenn man auf diese Detailseite zurückkommt.
    // So bleibt der Status von Herz und Wunschliste aktuell.
    useFocusEffect(
        useCallback(() => {
            if (currentRecipe) {
                loadStatus(currentRecipe);
            }
        }, [currentRecipe])
    );

    // Solange kein Rezept geladen wurde, wird ein Ladehinweis angezeigt.
    if (!currentRecipe) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Rezept wird geladen...</Text>
            </View>
        );
    }

    // Ab hier weiß TypeScript: recipe ist sicher nicht null.
    const recipe = currentRecipe;

    // Fügt ein Rezept zur Wunschliste hinzu oder entfernt es wieder.
    async function handleWishlist() {
        if (isInWishlist) {
            await removeFromWishlist(recipe.id);
            setIsInWishlist(false);

            Alert.alert(
                "Entfernt",
                "Rezept wurde aus der Wunschliste entfernt."
            );
        } else {
            await addToWishlist(recipe);
            setIsInWishlist(true);

            Alert.alert(
                "Gespeichert",
                "Rezept wurde zur Wunschliste hinzugefügt."
            );
        }
    }

    // Fügt ein Rezept zu Favoriten hinzu oder entfernt es wieder.
    async function handleFavorite() {
        if (isFavorite) {
            await removeFromFavorites(recipe.id);
            setIsFavorite(false);
        } else {
            await addToFavorites(recipe);
            setIsFavorite(true);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{recipe.title}</Text>

                <Pressable onPress={handleFavorite}>
                    <Text
                        style={[
                            styles.heart,
                            isFavorite && styles.heartActive,
                        ]}
                    >
                        ♥
                    </Text>
                </Pressable>
            </View>

            <View style={styles.metaRow}>
                <Text style={styles.meta}>⏱ {recipe.duration} Min.</Text>
                <Text style={styles.meta}>👥 2 Portionen</Text>
                <Text style={styles.meta}>▰ Einfach</Text>
            </View>

            <Image
                source={{ uri: recipe.imageUrl }}
                style={styles.image}
            />

            <View style={styles.tabs}>
                <Pressable
                    onPress={() => setActiveTab("ingredients")}
                    style={styles.tab}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "ingredients" &&
                            styles.activeTabText,
                        ]}
                    >
                        Zutaten
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setActiveTab("steps")}
                    style={styles.tab}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "steps" &&
                            styles.activeTabText,
                        ]}
                    >
                        Schritte
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setActiveTab("infos")}
                    style={styles.tab}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "infos" &&
                            styles.activeTabText,
                        ]}
                    >
                        Infos
                    </Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                {activeTab === "ingredients" && (
                    <>
                        <Text style={styles.sectionTitle}>Zutaten</Text>

                        {recipe.ingredients.map((ingredient, index) => (
                            <View key={`${ingredient}-${index}`} style={styles.ingredientRow}>
                                <Text style={styles.ingredientIcon}>🍅</Text>

                                <Text style={styles.ingredientName}>
                                    {ingredient}
                                </Text>
                            </View>
                        ))}
                    </>
                )}

                {activeTab === "steps" && (
                    <>
                        <Text style={styles.sectionTitle}>Zubereitung</Text>

                        {recipe.instructions.map((step, index) => (
                            <View key={`${step}-${index}`} style={styles.stepCard}>
                                <Text style={styles.stepNumber}>
                                    {index + 1}
                                </Text>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </>
                )}

                {activeTab === "infos" && (
                    <>
                        <Text style={styles.sectionTitle}>Infos</Text>

                        <Text style={styles.infoText}>
                            Dieses Rezept basiert auf deinen vorhandenen Zutaten
                            und eignet sich ideal zur Resteverwertung.
                        </Text>
                    </>
                )}

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={
                            isInWishlist
                                ? "🗑 Aus Wunschliste entfernen"
                                : "＋ Zur Wunschliste hinzufügen"
                        }
                        onPress={handleWishlist}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F4EA",
    },
    loadingText: {
        padding: 24,
        fontSize: 16,
        color: "#5E6C5B",
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        flex: 1,
        fontSize: 28,
        fontWeight: "bold",
        color: "#263A29",
    },
    heart: {
        fontSize: 30,
        color: "#C8C8C8",
        marginLeft: 16,
    },
    heartActive: {
        color: "#C0392B",
    },
    metaRow: {
        flexDirection: "row",
        gap: 16,
        paddingHorizontal: 24,
        marginTop: 10,
        marginBottom: 14,
    },
    meta: {
        color: "#5E6C5B",
        fontSize: 14,
        fontWeight: "600",
    },
    image: {
        width: "88%",
        height: 230,
        alignSelf: "center",
        borderRadius: 18,
        marginBottom: 14,
    },
    tabs: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#DAD7CD",
        marginHorizontal: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
    },
    tabText: {
        fontSize: 15,
        color: "#5E6C5B",
        fontWeight: "600",
    },
    activeTabText: {
        color: "#3A7D44",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#263A29",
        marginBottom: 16,
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E1D8",
    },
    ingredientIcon: {
        fontSize: 22,
        marginRight: 12,
    },
    ingredientName: {
        flex: 1,
        fontSize: 16,
        color: "#263A29",
    },
    ingredientAmount: {
        fontSize: 14,
        color: "#5E6C5B",
    },
    stepCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        gap: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#3A7D44",
        color: "#fff",
        textAlign: "center",
        lineHeight: 28,
        fontWeight: "bold",
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        color: "#263A29",
        lineHeight: 23,
    },
    infoText: {
        fontSize: 16,
        color: "#5E6C5B",
        lineHeight: 24,
    },
    buttonContainer: {
        marginTop: 24,
        marginBottom: 24,
    },
});