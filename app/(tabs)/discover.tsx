import { View, Text, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";
import { mockRecipes } from "../../data/mockRecipes";
import RecipeCard from "../../components/RecipeCard";

export default function DiscoverScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rezepte entdecken</Text>
            <Text style={styles.subtitle}>
                Basierend auf deinen Zutaten.
            </Text>

            <FlatList
                data={mockRecipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RecipeCard
                        recipe={item}
                        onPress={() => router.push(`/recipe/${item.id}`)}
                    />
                )}
            />
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
});