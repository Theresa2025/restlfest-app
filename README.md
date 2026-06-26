# 🍽️ RestlFest

RestlFest ist eine mobile Rezept-App, die Nutzerinnen und Nutzern dabei hilft, Lebensmittelreste sinnvoll zu verwerten. Nach dem Scannen oder der manuellen Eingabe vorhandener Zutaten werden passende Rezepte vorgeschlagen. Dadurch werden Lebensmittelverschwendung reduziert und neue Kochideen entdeckt.

---

## 📱 Funktionen

- 📷 Lebensmittel scannen (aktuell simuliert)
- ✍️ Zutaten manuell eingeben
- 🍳 Passende Rezepte anzeigen
- 👉 Rezepte per Swipe speichern oder verwerfen
- ❤️ Lieblingsrezepte verwalten
- 📋 Wunschliste speichern
- ✅ Rezepte als gekocht markieren
- 📖 Detailansicht mit Zutaten und Zubereitung
- 🌐 Rezeptsuche über die TheMealDB API

---

## 🛠️ Verwendete Technologien

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage
- TheMealDB API

---

## 📂 Projektstruktur

```text
restlfest-app/
│
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab-Navigation
│   │   ├── index.tsx            # Home
│   │   ├── discover.tsx         # Rezeptvorschläge (Swipe)
│   │   ├── wishlist.tsx         # Wunschliste
│   │   └── favorites.tsx        # Lieblingsrezepte
│   │
│   ├── recipe/
│   │   └── [id].tsx             # Rezeptdetail
│   │
│   ├── _layout.tsx              # Root Layout
│   ├── ingredients.tsx          # Zutaten bearbeiten
│   └── scan.tsx                 # Kamera / Scan
│
├── components/
│   ├── PrimaryButton.tsx
│   └── RecipeCard.tsx
│
├── data/
│   └── mockRecipes.ts
│
├── services/
│   ├── ingredientTranslator.ts  # Übersetzung DE → EN
│   ├── recipeApi.ts             # TheMealDB API
│   └── storage.ts               # AsyncStorage
│
├── types/
│   └── Recipe.ts
│
├── App.tsx
├── index.ts
├── app.json
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## 🚀 Installation

Repository klonen

```bash
git clone https://github.com/USERNAME/restlfest.git
```

Projekt öffnen

```bash
cd restlfest
```

Abhängigkeiten installieren

```bash
npm install
```

Projekt starten

```bash
npx expo start
```

---

## 🌐 Verwendete API

Die App verwendet die öffentliche **TheMealDB API**, um passende Rezepte anhand ausgewählter Zutaten abzurufen.

https://www.themealdb.com/api.php

---

## ⚠️ Bekannte Einschränkungen

- Die Lebensmittelerkennung über die Kamera wird aktuell simuliert.
- Die Rezeptdauer ist bei API-Rezepten ein Standardwert.
- Die Rezeptsuche basiert auf einer einzelnen ausgewählten Hauptzutat.

---

## 👩‍💻 Entwicklerinnen

Projekt im Rahmen des KWM-Unterrichts.

Entwickelt von:

- Theresa Kreindl
- Christa Sattler

---

## 📄 Lizenz

Dieses Projekt wurde im Rahmen der Lehrveranstaltung
**KWM – Mobile Web Apps** entwickelt und dient ausschließlich
zu Ausbildungs- und Demonstrationszwecken.