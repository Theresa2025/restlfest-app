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

export async function fetchRecipeDetailsById(
    id: string
): Promise<Recipe | null> {
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
        return null;
    }

    const meal = data.meals[0];

    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim().length > 0) {
            ingredients.push(
                `${measure ? measure.trim() : ""} ${ingredient.trim()}`
            );
        }
    }

    return {
        id: meal.idMeal,
        title: meal.strMeal,
        duration: 30,
        ingredients,
        instructions: meal.strInstructions
            ? meal.strInstructions
                .split(".")
                .map((step: string) => step.trim())
                .filter((step: string) => step.length > 0)
            : ["Keine Anleitung verfügbar."],
        imageUrl: meal.strMealThumb,
    };
}