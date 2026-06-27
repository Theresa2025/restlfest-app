import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Recipe } from "../types/Recipe";

type RecipeCardProps = {
    recipe: Recipe;
    onPress: () => void;
    onFavoritePress?: () => void;
    onRemovePress?: () => void;
    isFavorite?: boolean;
};

export default function RecipeCard({
                                       recipe,
                                       onPress,
                                       onFavoritePress,
                                       onRemovePress,
                                       isFavorite = false,
                                   }: RecipeCardProps) {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>

                <Text style={styles.duration}>
                    ⏱ {recipe.duration} Minuten
                </Text>

                <Text style={styles.ingredients} numberOfLines={1}>
                    {recipe.ingredients.join(", ")}
                </Text>
            </View>

            <View style={styles.actions}>
                {onFavoritePress && (
                    <Pressable onPress={onFavoritePress}>
                        <Text
                            style={[
                                styles.icon,
                                isFavorite && styles.favoriteIcon,
                            ]}
                        >
                            ♥
                        </Text>
                    </Pressable>
                )}

                {onRemovePress && (
                    <Pressable onPress={onRemovePress}>
                        <Text style={styles.trashIcon}>🗑</Text>
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        flexDirection: "row",
        overflow: "hidden",
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E5E1D8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 110,
        height: 110,
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#263A29",
    },
    duration: {
        marginTop: 6,
        color: "#3A7D44",
        fontWeight: "600",
    },
    ingredients: {
        marginTop: 8,
        color: "#5E6C5B",
        fontSize: 13,
    },
    actions: {
        width: 48,
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 14,
    },
    icon: {
        fontSize: 26,
        color: "#C8C8C8",
    },
    favoriteIcon: {
        color: "#C0392B",
    },
    trashIcon: {
        fontSize: 22,
    },
});