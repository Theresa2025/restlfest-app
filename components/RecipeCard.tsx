import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Recipe } from "../types/Recipe";

// Props definieren, die die RecipeCard von der übergeordneten Komponente erhält.
type RecipeCardProps = {
    recipe: Recipe; // Das anzuzeigende Rezept
    onPress: () => void; // Wird ausgeführt, wenn die komplette Karte angeklickt wird
    onFavoritePress?: () => void; // Optional: Rezept als Favorit markieren
    onRemovePress?: () => void;  // Optional: Rezept entfernen
    isFavorite?: boolean; // Gibt an, ob das Rezept bereits als Favorit gespeichert wurde
};

// Wiederverwendbare Komponente zur Darstellung eines Rezeptes
export default function RecipeCard({
                                       recipe,
                                       onPress,
                                       onFavoritePress,
                                       onRemovePress,
                                       isFavorite = false,
                                   }: RecipeCardProps) {
    return (
        // Pressable macht die komplette Rezeptkarte anklickbar
        <Pressable style={styles.card} onPress={onPress}>
            {/* Rezeptbild wird über die Bild-URL geladen */}
            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

            {/* Informationen zum Rezept */}
            <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>

                <Text style={styles.duration}>
                    ⏱ {recipe.duration} Minuten
                </Text>

                {/* Zutaten werden als kommaseparierte Liste dargestellt.
                    numberOfLines verhindert, dass der Text zu viele Zeilen belegt. */}
                <Text style={styles.ingredients} numberOfLines={1}>
                    {recipe.ingredients.join(", ")}
                </Text>
            </View>

            {/* Bereich für optionale Aktionen */}
            <View style={styles.actions}>

                {/* Herzsymbol wird nur angezeigt,
                    wenn eine onFavoritePress-Funktion übergeben wurde */}
                {onFavoritePress && (
                    <Pressable onPress={onFavoritePress}>
                        <Text
                            style={[
                                styles.icon,

                                // Ist das Rezept Favorit, wird das Herz rot eingefärbt
                                isFavorite && styles.favoriteIcon,
                            ]}
                        >
                            ♥
                        </Text>
                    </Pressable>
                )}

                {/* Papierkorb wird nur angezeigt,
                    wenn eine Löschfunktion vorhanden ist */}
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