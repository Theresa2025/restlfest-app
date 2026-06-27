import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, ActivityIndicator, } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { mockRecipes } from "../../data/mockRecipes";
import RecipeCard from "../../components/RecipeCard";
import PrimaryButton from "../../components/PrimaryButton";
import { addToWishlist, saveSelectedRecipe } from "../../services/storage";
import { fetchRecipesByIngredient } from "../../services/recipeApi";
import { Recipe } from "../../types/Recipe";

export default function DiscoverScreen() {
    const params = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [savedCount, setSavedCount] = useState(0);

    const position = useRef(new Animated.ValueXY()).current;

    const selectedIngredients =
        typeof params.ingredients === "string"
            ? params.ingredients
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter((item) => item.length > 0)
            : [];

    function resetPosition() {
        position.setValue({ x: 0, y: 0 });
    }

    useEffect(() => {
        async function loadRecipesFromApi() {
            setCurrentIndex(0);
            setSavedCount(0);
            resetPosition();

            if (selectedIngredients.length === 0) {
                setApiRecipes([]);
                return;
            }

            setLoading(true);

            try {
                const recipesFromApi = await fetchRecipesByIngredient(
                    selectedIngredients[0]
                );

                setApiRecipes(recipesFromApi);
            } catch (error) {
                console.log("API Fehler:", error);
                setApiRecipes([]);
            } finally {
                setLoading(false);
            }
        }

        loadRecipesFromApi();
    }, [params.ingredients]);

    const filteredRecipes =
        apiRecipes.length > 0
            ? apiRecipes
            : selectedIngredients.length === 0
                ? mockRecipes
                : mockRecipes.filter((recipe) =>
                    recipe.ingredients.some((ingredient) =>
                        selectedIngredients.includes(
                            ingredient.toLowerCase()
                        )
                    )
                );

    const currentRecipe = filteredRecipes[currentIndex];

    function nextRecipe() {
        setCurrentIndex((index) => index + 1);
        resetPosition();
    }

    async function saveRecipe(recipe: Recipe) {
        await addToWishlist(recipe);
        setSavedCount((count) => count + 1);
        nextRecipe();
    }

    function swipeLeft() {
        Animated.timing(position, {
            toValue: { x: -500, y: 0 },
            duration: 250,
            useNativeDriver: false,
        }).start(() => {
            nextRecipe();
        });
    }

    function swipeRight() {
        if (!currentRecipe) return;

        Animated.timing(position, {
            toValue: { x: 500, y: 0 },
            duration: 250,
            useNativeDriver: false,
        }).start(async () => {
            await saveRecipe(currentRecipe);
        });
    }

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderMove: (_, gesture) => {
                position.setValue({
                    x: gesture.dx,
                    y: gesture.dy,
                });
            },

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > 120) {
                    swipeRight();
                } else if (gesture.dx < -120) {
                    swipeLeft();
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const rotate = position.x.interpolate({
        inputRange: [-250, 0, 250],
        outputRange: ["-12deg", "0deg", "12deg"],
    });

    const likeOpacity = position.x.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const nopeOpacity = position.x.interpolate({
        inputRange: [-120, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const animatedCardStyle = {
        transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate },
        ],
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.title}>Rezepte entdecken</Text>

                <ActivityIndicator
                    size="large"
                    color="#3A7D44"
                    style={styles.loader}
                />

                <Text style={styles.emptyText}>
                    Passende Rezepte werden gesucht...
                </Text>
            </View>
        );
    }

    if (!currentRecipe) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.finishIcon}>🎉</Text>

                <Text style={styles.title}>Fertig entdeckt</Text>

                <Text style={styles.emptyText}>
                    Du hast alle Rezeptvorschläge angesehen.
                </Text>

                {savedCount > 0 ? (
                    <>
                        <Text style={styles.emptyText}>
                            Du hast {savedCount} Rezept(e) gespeichert.
                        </Text>

                        <View style={styles.finishButton}>
                            <PrimaryButton
                                title="Zur Wunschliste"
                                onPress={() => router.push("/(tabs)/wishlist")}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.emptyText}>
                            Es wurde kein Rezept gespeichert.
                        </Text>

                        <View style={styles.finishButton}>
                            <PrimaryButton
                                title="Zutaten bearbeiten"
                                onPress={() =>
                                    router.push({
                                        pathname: "/ingredients",
                                        params: {
                                            detected: selectedIngredients.join(","),
                                        },
                                    })
                                }
                            />
                        </View>
                    </>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rezepte entdecken</Text>

            <Text style={styles.subtitle}>
                Swipe nach rechts, wenn dir das Rezept gefällt.
                {"\n"}
                Swipe nach links, wenn nicht.
            </Text>

            <Text style={styles.counterText}>
                Rezept {currentIndex + 1} von {filteredRecipes.length}
            </Text>

            <View style={styles.progressContainer}>
                {filteredRecipes.map((recipe, index) => (
                    <View
                        key={recipe.id}
                        style={[
                            styles.progressBar,
                            index <= currentIndex && styles.progressBarActive,
                        ]}
                    />
                ))}
            </View>

            <Animated.View
                style={animatedCardStyle}
                {...panResponder.panHandlers}
            >
                <Animated.Text
                    style={[styles.likeLabel, { opacity: likeOpacity }]}
                >
                    SPEICHERN
                </Animated.Text>

                <Animated.Text
                    style={[styles.nopeLabel, { opacity: nopeOpacity }]}
                >
                    VERWERFEN
                </Animated.Text>

                <RecipeCard
                    recipe={currentRecipe}
                    onPress={async () => {
                        await saveSelectedRecipe(currentRecipe);
                        router.push(`/recipe/${currentRecipe.id}`);
                    }}
                />
            </Animated.View>

            <View style={styles.buttonRow}>
                <PrimaryButton title="Verwerfen" onPress={swipeLeft} />
                <PrimaryButton title="Speichern" onPress={swipeRight} />
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
        fontSize: 14,
        color: "#5E6C5B",
        marginTop: 8,
        marginBottom: 8,
        textAlign: "center",
        lineHeight: 20,
    },

    emptyText: {
        fontSize: 16,
        color: "#5E6C5B",
        marginTop: 12,
        marginBottom: 12,
        textAlign: "center",
        lineHeight: 23,
    },

    buttonRow: {
        marginTop: 20,
        gap: 12,
    },

    likeLabel: {
        position: "absolute",
        top: 30,
        left: 24,
        zIndex: 10,
        color: "#3A7D44",
        fontSize: 28,
        fontWeight: "bold",
        borderWidth: 3,
        borderColor: "#3A7D44",
        padding: 8,
        borderRadius: 8,
        transform: [{ rotate: "-12deg" }],
    },

    nopeLabel: {
        position: "absolute",
        top: 30,
        right: 24,
        zIndex: 10,
        color: "#B00020",
        fontSize: 28,
        fontWeight: "bold",
        borderWidth: 3,
        borderColor: "#B00020",
        padding: 8,
        borderRadius: 8,
        transform: [{ rotate: "12deg" }],
    },

    counterText: {
        fontSize: 14,
        color: "#5E6C5B",
        textAlign: "center",
        marginBottom: 10,
    },

    progressContainer: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 20,
    },

    progressBar: {
        flex: 1,
        height: 5,
        borderRadius: 8,
        backgroundColor: "#E0DED6",
    },

    progressBarActive: {
        backgroundColor: "#3A7D44",
    },

    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },

    loader: {
        marginTop: 24,
        marginBottom: 12,
    },

    finishIcon: {
        fontSize: 54,
        marginBottom: 16,
    },

    finishButton: {
        marginTop: 12,
        width: "100%",
    },
});