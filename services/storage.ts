//lokaler Speicher auf Smartphone
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/Recipe";

const WISHLIST_KEY = "restlfest_wishlist";
const FAVORITES_KEY = "restlfest_favorites";

//Wunschliste laden
export async function getWishlist(): Promise<Recipe[]> {
   //gespeicherte daten auslesen
    const data = await AsyncStorage.getItem(WISHLIST_KEY);
    //wenn Daten vorhanden-> in Array umgewandelt
    return data ? JSON.parse(data) : [];
}

//Rezept zur Wunschliste hinzufügen
export async function addToWishlist(recipe: Recipe): Promise<void> {
    //aktuelle Liste laden
    const wishlist = await getWishlist();

    //prüfen, ob bereits vorhanden
    const alreadyExists = wishlist.some((item) => item.id === recipe.id);

    //nur speichern, wenn es noch nciht existiert
    if (!alreadyExists) {
        //am Ende anhängen und in JSON speichern
        await AsyncStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify([...wishlist, recipe])
        );
    }
}

//Rezept aus der Wunschliste entfernen
export async function removeFromWishlist(recipeId: string): Promise<void> {
    //Wunschliste laden
    const wishlist = await getWishlist();

    //alle Rezepte behalten, außer jenes mit der übergeben ID
    const updatedWishlist = wishlist.filter(
        (item) => item.id !== recipeId
    );

    //neue Liste speichern
    await AsyncStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(updatedWishlist)
    );
}

//Favouriten laden
export async function getFavorites(): Promise<Recipe[]> {
    //aus AsyncStorage lesen
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    //falls Daten vorhanden-> JSON wieder in Array umwandeln
    return data ? JSON.parse(data) : [];
}


//Rezept zu Favoriten hinzufügen
export async function addToFavorites(recipe: Recipe): Promise<void> {
    //Favoriten laden
    const favorites = await getFavorites();

    //Prüfen, ob bereits exisiert
    const alreadyExists = favorites.some((item) => item.id === recipe.id);

    //nur speichern, wenn noch nicht vorhanden
    if (!alreadyExists) {
        await AsyncStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify([...favorites, recipe])
        );
    }
}

//Rezept aus Favoriten entfernen
export async function removeFromFavorites(recipeId: string): Promise<void> {
    //Favoriten laden
    const favorites = await getFavorites();

    //Gewünschtes Rezept entfernen
    const updatedFavorites = favorites.filter(
        (item) => item.id !== recipeId
    );

    //Aktualisieren und speichern
    await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
    );
}

//Schlüssel für das zuletzt ausgwählte Rezept
const SELECTED_RECIPE_KEY = "restlfest_selected_recipe";


//Aktuell ausgewähltes Rezept speichern
export async function saveSelectedRecipe(recipe: Recipe): Promise<void> {
    //Rezept wird als JSON gespeichert
    await AsyncStorage.setItem(
        SELECTED_RECIPE_KEY,
        JSON.stringify(recipe)
    );
}

//zuletzt ausgewähltes Rezept laden
export async function getSelectedRecipe(): Promise<Recipe | null> {
    //Rezept aus AsyncStorage lesen
    const data = await AsyncStorage.getItem(SELECTED_RECIPE_KEY);

    //Falls vorhanden-> JSON in Objekt umwandeln
    //Falls nicht vorhanden -> null zurückgeben
    return data ? JSON.parse(data) : null;
}