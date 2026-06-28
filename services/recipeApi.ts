import { Recipe } from "../types/Recipe";
import { translateIngredient } from "./ingredientTranslator";


//Lädt passende Rezepte zu einer Zutat
export async function fetchRecipesByIngredient(
    ingredient: string
): Promise<Recipe[]> {

    //Übersetzung von deutsch in englisch
    const translatedIngredient =
        translateIngredient(ingredient);

    //Anfrage (http get) an die API
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${translatedIngredient}`
    );

    //Antwort wird umgewandelt von JSON in JavaScript- Objekt
    const data = await response.json();

    //kein Rezept gefunden -> leeres Array
    if (!data.meals) {
        return [];
    }

    //nur die ersten 5. Rezepte verwenden
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

//Lädt die vollständigen Details eines Rezepts
export async function fetchRecipeDetailsById(
    id: string
): Promise<Recipe | null> {
    //Anfrage an API mit Rezept-ID -> alle Information zu dem Rezept geladen
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    //wieder umwandeln
    const data = await response.json();

    //keine Daten gefunden -> null
    if (!data.meals || data.meals.length === 0) {
        return null;
    }

    //API liefert genau ein Rezept
    const meal = data.meals[0];

    //später hier Zutaten speichern
    const ingredients: string[] = [];

    //API besitzt max. 20 Zutatenfelder
    for (let i = 1; i <= 20; i++) {
        //aktuelle Zutat auslesen
        const ingredient = meal[`strIngredient${i}`];
        //wenn tatsächlich vorhanden wird diese übernommen
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim().length > 0) {
            //Menge + Zutat zusammenfügen
            ingredients.push(
                `${measure ? measure.trim() : ""} ${ingredient.trim()}`
            );
        }
    }

    //fertige Recipe-Objekt wird zurückgegeben
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