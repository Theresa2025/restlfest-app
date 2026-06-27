import { Stack } from "expo-router";

// RootLayout definiert die Hauptnavigation der App.
// Hier werden alle Screens registriert, die per Stack-Navigation geöffnet werden können.
export default function RootLayout() {
    return (
        <Stack>
            {/* (tabs) ist der Einstiegspunkt der App.
              Dieser Screen enthält die Tab-Navigation (Home, Discover,
              Wishlist und Favorites). Der Header wird ausgeblendet,
              da jeder Tab seinen eigenen Header besitzt. */}
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            />

            {/* Screen zum Scannen bzw. Fotografieren von Lebensmitteln.
              Wird vom Home-Screen aus geöffnet. */}
            <Stack.Screen
                name="scan"
                options={{ title: "Lebensmittel scannen" }}
            />

            {/* Nach dem Scannen werden die erkannten Zutaten
              (aktuell simuliert) angezeigt und können bearbeitet werden. */}
            <Stack.Screen
                name="ingredients"
                options={{ title: "Zutaten bearbeiten" }}
            />

            {/* Dynamischer Screen für die Detailansicht eines Rezepts.
              [id] ist ein dynamischer Parameter, sodass für jedes
              Rezept dieselbe Seite verwendet werden kann.
              Beispiel: /recipe/1 oder /recipe/52977 */}
            <Stack.Screen
                name="recipe/[id]"
                options={{ title: "Rezept" }}
            />
        </Stack>
    );
}