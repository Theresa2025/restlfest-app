import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Recipe } from "../types/Recipe";

type RecipeCardProps = {
    recipe: Recipe;
    onPress: () => void;
};

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.meta}>{recipe.duration} Minuten</Text>
                <Text style={styles.ingredients}>
                    {recipe.ingredients.join(", ")}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        marginBottom: 16,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 160,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#263A29",
    },
    meta: {
        marginTop: 6,
        color: "#3A7D44",
        fontWeight: "bold",
    },
    ingredients: {
        marginTop: 8,
        color: "#5E6C5B",
    },
});