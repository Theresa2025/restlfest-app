import { Recipe } from "../types/Recipe";
import { translateIngredient } from "./ingredientTranslator";

export async function fetchRecipesByIngredient(
    ingredient: string
): Promise<Recipe[]> {
    const translatedIngredient =
        translateIngredient(ingredient);

    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedIngredient}`
    );

    const data = await response.json();

    if (!data.meals) {
        return [];
    }

    return data.meals.slice(0, 5).map((meal: any) => ({
        id: meal.idMeal,
        title: meal.strMeal,
        duration: 30,
        ingredients: [ingredient],
        instructions: [
            "Dieses Rezept wurde über die API geladen.",
            "Für genaue Schritte bitte später Detaildaten abrufen."
        ],
        imageUrl: meal.strMealThumb,
    }));
}