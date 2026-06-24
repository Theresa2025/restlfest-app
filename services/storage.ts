import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/Recipe";

const WISHLIST_KEY = "restlfest_wishlist";
const FAVORITES_KEY = "restlfest_favorites";

export async function getWishlist(): Promise<Recipe[]> {
    const data = await AsyncStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
}

export async function addToWishlist(recipe: Recipe): Promise<void> {
    const wishlist = await getWishlist();

    const alreadyExists = wishlist.some((item) => item.id === recipe.id);

    if (!alreadyExists) {
        await AsyncStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify([...wishlist, recipe])
        );
    }
}

export async function removeFromWishlist(recipeId: string): Promise<void> {
    const wishlist = await getWishlist();

    const updatedWishlist = wishlist.filter(
        (item) => item.id !== recipeId
    );

    await AsyncStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(updatedWishlist)
    );
}

export async function getFavorites(): Promise<Recipe[]> {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
}

export async function addToFavorites(recipe: Recipe): Promise<void> {
    const favorites = await getFavorites();

    const alreadyExists = favorites.some((item) => item.id === recipe.id);

    if (!alreadyExists) {
        await AsyncStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify([...favorites, recipe])
        );
    }
}

export async function removeFromFavorites(recipeId: string): Promise<void> {
    const favorites = await getFavorites();

    const updatedFavorites = favorites.filter(
        (item) => item.id !== recipeId
    );

    await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
    );
}

const SELECTED_RECIPE_KEY = "restlfest_selected_recipe";

export async function saveSelectedRecipe(recipe: Recipe): Promise<void> {
    await AsyncStorage.setItem(
        SELECTED_RECIPE_KEY,
        JSON.stringify(recipe)
    );
}

export async function getSelectedRecipe(): Promise<Recipe | null> {
    const data = await AsyncStorage.getItem(SELECTED_RECIPE_KEY);
    return data ? JSON.parse(data) : null;
}