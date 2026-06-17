import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    PanResponder,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { mockRecipes } from "../../data/mockRecipes";
import RecipeCard from "../../components/RecipeCard";
import PrimaryButton from "../../components/PrimaryButton";
import { addToWishlist } from "../../services/storage";
import { Recipe } from "../../types/Recipe";

export default function DiscoverScreen() {
    const params = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);

    const position = useRef(new Animated.ValueXY()).current;

    const selectedIngredients =
        typeof params.ingredients === "string"
            ? params.ingredients
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter((item) => item.length > 0)
            : [];

    const filteredRecipes =
        selectedIngredients.length === 0
            ? mockRecipes
            : mockRecipes.filter((recipe) =>
                recipe.ingredients.some((ingredient) =>
                    selectedIngredients.includes(
                        ingredient.toLowerCase()
                    )
                )
            );

    const currentRecipe = filteredRecipes[currentIndex];

    useEffect(() => {
        setCurrentIndex(0);
        resetPosition();
    }, [params.ingredients]);

    function resetPosition() {
        position.setValue({ x: 0, y: 0 });
    }

    function nextRecipe() {
        setCurrentIndex((index) => index + 1);
        resetPosition();
    }

    async function saveRecipe(recipe: Recipe) {
        await addToWishlist(recipe);
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
                if (gesture.dx > 120 && currentRecipe) {
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
                    ? "Swipe rechts zum Speichern, links zum Verwerfen."
                    : `Passend zu: ${selectedIngredients.join(", ")}`}
            </Text>

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
                    onPress={() =>
                        router.push(`/recipe/${currentRecipe.id}`)
                    }
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
});