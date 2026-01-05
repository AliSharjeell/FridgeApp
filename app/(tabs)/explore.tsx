import { getItems, getRecipes } from "@/services/db";
import { Item, Recipe } from "@/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
      loadRecipes();
    }, [])
  );

  const loadItems = async () => {
    const data = await getItems("confirmed");
    setItems(data);
  };

  const loadRecipes = async () => {
    const data = await getRecipes();
    setRecipes(data);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.appTitle}>Global Properties 🌎</Text>

      {/* --- INVENTORY SECTION --- */}
      <View style={styles.cardPrimary}>
        <Text style={styles.cardTitle}>Inventory</Text>
        <Text style={styles.cardSubtitle}>All your confirmed items</Text>
      </View>

      <View style={styles.itemsGrid}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image
              source={{
                uri: item.image_url || "https://via.placeholder.com/150",
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
          </View>
        ))}
        {items.length === 0 && (
          <Text style={styles.emptyText}>Inventory is empty.</Text>
        )}
      </View>

      {/* --- RECIPES SECTION --- */}
      <View style={[styles.cardPrimary, styles.cardSecondary]}>
        <Text style={styles.cardTitle}>Suggested Recipes</Text>
        <Text style={styles.cardSubtitle}>Based on your inventory</Text>
      </View>

      <View style={styles.recipeList}>
        {recipes.map((recipe, i) => (
          <View key={i} style={styles.recipeCard}>
            {recipe.image_url && (
              <Image
                source={{ uri: recipe.image_url }}
                style={styles.recipeImage}
              />
            )}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <Text style={styles.recipeIngredientsLabel}>Ingredients:</Text>
              <Text style={styles.recipeIngredients}>
                {recipe.ingredients}
              </Text>
            </View>
          </View>
        ))}
        {recipes.length === 0 && (
          <Text style={styles.emptyText}>No recipes found.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 24,
    marginTop: 20,
  },
  cardPrimary: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardSecondary: {
    backgroundColor: "#FF9800", // Orange for Recipes
    marginTop: 32,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  // Inventory Grid Styles
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  itemCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: "100%",
    height: 100,
  },
  itemInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#666",
  },
  // Recipe List Styles
  recipeList: {
    flexDirection: "column",
    gap: 16,
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row", // Horizontal layout for recipes
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: 100,
    height: "100%",
    minHeight: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  recipeIngredientsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF9800",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  recipeIngredients: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    width: "100%",
  },
});
