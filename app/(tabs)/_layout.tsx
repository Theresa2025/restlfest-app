import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Layout für die untere Tab-Bar der App
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{

                // Blendet den Standard-Header aus,
                // da jeder Screen seinen eigenen Aufbau besitzt.
                headerShown: false,

                tabBarActiveTintColor: "#3A7D44",
                tabBarInactiveTintColor: "#9CA39A",

                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    height: 90,
                    paddingTop: 6,
                    paddingBottom: 8,
                    borderTopColor: "#E5E1D8",
                    borderTopWidth: 1,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                // Verknüpft den Tab mit app/(tabs)/index.tsx
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                // Verknüpft den Tab mit app/(tabs)/discover.tsx
                name="discover"
                options={{
                    title: "Entdecken",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="restaurant-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                // Verknüpft den Tab mit app/(tabs)/wishlist.tsx
                name="wishlist"
                options={{
                    title: "Wunschliste",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="bookmark-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                // Verknüpft den Tab mit app/(tabs)/favorites.tsx
                name="favorites"
                options={{
                    title: "Favoriten",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="heart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}