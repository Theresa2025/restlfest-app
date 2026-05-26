import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="scan"
                options={{ title: "Lebensmittel scannen" }}
            />

            <Stack.Screen
                name="ingredients"
                options={{ title: "Zutaten bearbeiten" }}
            />

            <Stack.Screen
                name="recipe/[id]"
                options={{ title: "Rezept" }}
            />
        </Stack>
    );
}