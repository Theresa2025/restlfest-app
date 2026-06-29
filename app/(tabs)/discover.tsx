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
    // Liest Parameter aus der URL, z.B. Zutaten aus ingredients.tsx
    const params = useLocalSearchParams();

    // Speichert, welches Rezept gerade angezeigt wird
    const [currentIndex, setCurrentIndex] = useState(0);

    // Speichert Rezepte, die von der externen API geladen wurden
    const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);

    // Zeigt an, ob gerade API-Daten geladen werden
    const [loading, setLoading] = useState(false);

    // Zählt, wie viele Rezepte im aktuellen Durchlauf gespeichert wurden
    const [savedCount, setSavedCount] = useState(0);

    // Animated.ValueXY speichert die aktuelle Position der Swipe-Karte
    const position = useRef(new Animated.ValueXY()).current;

    // Zutaten werden aus den URL-Parametern gelesen und in ein Array umgewandelt
    const selectedIngredients =
        typeof params.ingredients === "string"
            ? params.ingredients
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter((item) => item.length > 0)
            : [];

    // Setzt die Karte wieder in die Ausgangsposition
    function resetPosition() {
        position.setValue({ x: 0, y: 0 });
    }

    // Lädt neue Rezepte, sobald sich die Zutaten ändern
    useEffect(() => {
        async function loadRecipesFromApi() {
            // Bei neuer Suche starten wir wieder beim ersten Rezept
            setCurrentIndex(0);
            setSavedCount(0);
            resetPosition();

            // Wenn keine Zutaten übergeben wurden, werden nur Mockdaten verwendet
            if (selectedIngredients.length === 0) {
                setApiRecipes([]);
                return;
            }

            setLoading(true);

            try {
                // Für die API wird aktuell die erste ausgewählte Zutat verwendet
                const recipesFromApi = await fetchRecipesByIngredient(
                    selectedIngredients[0]
                );

                setApiRecipes(recipesFromApi);
            } catch (error) {
                // Falls die API fehlschlägt, wird auf Mockdaten zurückgegriffen
                console.log("API Fehler:", error);
                setApiRecipes([]);
            } finally {
                setLoading(false);
            }
        }

        loadRecipesFromApi();
    }, [params.ingredients]);

    // Entscheidet, welche Rezepte angezeigt werden:
    // 1. API-Rezepte, falls vorhanden
    // 2. alle Mock-Rezepte, wenn keine Zutaten ausgewählt wurden
    // 3. gefilterte Mock-Rezepte als Fallback
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

    // Aktuelles Rezept anhand des Index
    const currentRecipe = filteredRecipes[currentIndex];

    // Springt zum nächsten Rezept
    function nextRecipe() {
        setCurrentIndex((index) => index + 1);
        resetPosition();
    }

    // Speichert ein Rezept in der Wunschliste
    async function saveRecipe(recipe: Recipe) {
        await addToWishlist(recipe);
        setSavedCount((count) => count + 1);
        nextRecipe();
    }

    // Animation für Swipe nach links = verwerfen
    function swipeLeft() {
        Animated.timing(position, {
            toValue: { x: -500, y: 0 },
            duration: 250,
            useNativeDriver: false,
        }).start(() => {
            nextRecipe();
        });
    }

    // Animation für Swipe nach rechts = speichern
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

    // PanResponder erkennt die Fingerbewegung für echtes Swipen
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            // Während des Ziehens wird die Karte mit dem Finger bewegt
            onPanResponderMove: (_, gesture) => {
                position.setValue({
                    x: gesture.dx,
                    y: gesture.dy,
                });
            },

            // Beim Loslassen wird entschieden: speichern, verwerfen oder zurückspringen
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

    // Je weiter die Karte gezogen wird, desto stärker dreht sie sich
    const rotate = position.x.interpolate({
        inputRange: [-250, 0, 250],
        outputRange: ["-12deg", "0deg", "12deg"],
    });

    // Label „SPEICHERN“ wird beim Ziehen nach rechts sichtbar
    const likeOpacity = position.x.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    // Label „VERWERFEN“ wird beim Ziehen nach links sichtbar
    const nopeOpacity = position.x.interpolate({
        inputRange: [-120, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    // Kombiniert Bewegung und Rotation zur finalen Kartenanimation
    const animatedCardStyle = {
        transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate },
        ],
    };

    // Ladeanzeige während API-Rezepte gesucht werden
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

    // Anzeige, wenn alle Rezepte durchgesehen wurden
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

            {/* Alternative Buttons für Nutzer, die nicht swipen möchten */}
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
        paddingTop: 40,
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