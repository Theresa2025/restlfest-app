import { Recipe } from "../types/Recipe";

export const mockRecipes: Recipe[] = [
    {
        id: "1",
        title: "Tomaten-Mozzarella Pasta",
        duration: 25,
        ingredients: ["Tomaten", "Mozzarella", "Nudeln"],
        instructions: [
            "Nudeln in Salzwasser kochen.",
            "Tomaten klein schneiden.",
            "Mozzarella in Würfel schneiden.",
            "Alles vermengen und mit Basilikum servieren."
        ],
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    },
    {
        id: "2",
        title: "Gemüsepfanne",
        duration: 20,
        ingredients: ["Paprika", "Zucchini", "Reis"],
        instructions: [
            "Reis nach Packungsanleitung kochen.",
            "Gemüse waschen und klein schneiden.",
            "Zwiebel in einer Pfanne anbraten.",
            "Gemüse hinzufügen und kurz anbraten.",
            "Mit Reis servieren."
        ],
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    },
    {
        id: "3",
        title: "Schneller Salat",
        duration: 10,
        ingredients: ["Salat", "Tomaten", "Gurke"],
        instructions: [
            "Salat waschen und schneiden.",
            "Tomaten und Gurke klein schneiden.",
            "Feta zerbröseln.",
            "Alles in einer Schüssel vermengen."
        ],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    },
];