import { Recipe } from "../types/Recipe";

export const mockRecipes: Recipe[] = [
    {
        id: "1",
        title: "Tomaten-Mozzarella Pasta",
        duration: 25,
        ingredients: ["Tomaten", "Mozzarella", "Nudeln"],
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    },
    {
        id: "2",
        title: "Gemüsepfanne",
        duration: 20,
        ingredients: ["Paprika", "Zucchini", "Reis"],
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    },
    {
        id: "3",
        title: "Schneller Salat",
        duration: 10,
        ingredients: ["Salat", "Tomaten", "Gurke"],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    },
];