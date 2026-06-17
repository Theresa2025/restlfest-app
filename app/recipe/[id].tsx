import { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    Pressable,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

import { Recipe } from "../../types/Recipe";
import { mockRecipes } from "../../data/mockRecipes";
import PrimaryButton from "../../components/PrimaryButton";
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
} from "../../services/storage";

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();

    const [activeTab, setActiveTab] =
        useState<"ingredients" | "steps" | "infos">("ingredients");

    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const recipe = mockRecipes.find((item) => item.id === id);

    if (!recipe) {
        return (
            <View style={styles.container}>
                <Text>Rezept nicht gefunden.</Text>
            </View>
        );
    }

    const currentRecipe: Recipe = recipe;

    async function loadStatus() {
        const wishlist = await getWishlist();
        const favorites = await getFavorites();

        setIsInWishlist(
            wishlist.some((item) => item.id === currentRecipe.id)
        );

        setIsFavorite(
            favorites.some((item) => item.id === currentRecipe.id)
        );
    }

    useFocusEffect(
        useCallback(() => {
            loadStatus();
        }, [currentRecipe.id])
    );

    async function handleWishlist() {
        if (isInWishlist) {
            await removeFromWishlist(currentRecipe.id);
            setIsInWishlist(false);

            Alert.alert(
                "Entfernt",
                "Rezept wurde aus der Wunschliste entfernt."
            );
        } else {
            await addToWishlist(currentRecipe);
            setIsInWishlist(true);

            Alert.alert(
                "Gespeichert",
                "Rezept wurde zur Wunschliste hinzugefügt."
            );
        }
    }

    async function handleFavorite() {
        if (isFavorite) {
            await removeFromFavorites(currentRecipe.id);
            setIsFavorite(false);
        } else {
            await addToFavorites(currentRecipe);
            setIsFavorite(true);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{currentRecipe.title}</Text>

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
                <Text style={styles.meta}>
                    ⏱ {currentRecipe.duration} Min.
                </Text>
                <Text style={styles.meta}>👥 2 Portionen</Text>
                <Text style={styles.meta}>▰ Einfach</Text>
            </View>

            <Image
                source={{ uri: currentRecipe.imageUrl }}
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
                            activeTab === "steps" && styles.activeTabText,
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
                            activeTab === "infos" && styles.activeTabText,
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

                        {currentRecipe.ingredients.map((ingredient) => (
                            <View
                                key={ingredient}
                                style={styles.ingredientRow}
                            >
                                <Text style={styles.ingredientIcon}>🍅</Text>

                                <Text style={styles.ingredientName}>
                                    {ingredient}
                                </Text>

                                <Text style={styles.ingredientAmount}>
                                    nach Bedarf
                                </Text>
                            </View>
                        ))}
                    </>
                )}

                {activeTab === "steps" && (
                    <>
                        <Text style={styles.sectionTitle}>Zubereitung</Text>

                        {currentRecipe.instructions.map((step, index) => (
                            <View key={index} style={styles.stepCard}>
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