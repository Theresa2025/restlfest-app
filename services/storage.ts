import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/Recipe";

const WISHLIST_KEY = "restlfest_wishlist";
const COOKED_KEY = "restlfest_cooked";

export async function getWishlist(): Promise<Recipe[]> {
    const data = await AsyncStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
}

export async function addToWishlist(recipe: Recipe): Promise<void> {
    const currentWishlist = await getWishlist();

    const alreadyExists = currentWishlist.some(
        (item) => item.id === recipe.id
    );

    if (!alreadyExists) {
        await AsyncStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify([...currentWishlist, recipe])
        );
    }
}

export async function removeFromWishlist(recipeId: string): Promise<void> {
    const currentWishlist = await getWishlist();

    const updatedWishlist = currentWishlist.filter(
        (item) => item.id !== recipeId
    );

    await AsyncStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(updatedWishlist)
    );
}

export async function getCookedRecipes(): Promise<Recipe[]> {
    const data = await AsyncStorage.getItem(COOKED_KEY);
    return data ? JSON.parse(data) : [];
}

export async function markAsCooked(recipe: Recipe): Promise<void> {
    const cookedRecipes = await getCookedRecipes();

    const alreadyCooked = cookedRecipes.some(
        (item) => item.id === recipe.id
    );

    if (!alreadyCooked) {
        await AsyncStorage.setItem(
            COOKED_KEY,
            JSON.stringify([...cookedRecipes, recipe])
        );
    }

    await removeFromWishlist(recipe.id);
}

export async function removeFromCooked(recipeId: string): Promise<void> {
    const cookedRecipes = await getCookedRecipes();

    const updatedCookedRecipes = cookedRecipes.filter(
        (item) => item.id !== recipeId
    );

    await AsyncStorage.setItem(
        COOKED_KEY,
        JSON.stringify(updatedCookedRecipes)
    );
}

export async function moveBackToWishlist(recipe: Recipe): Promise<void> {
    await removeFromCooked(recipe.id);
    await addToWishlist(recipe);
}