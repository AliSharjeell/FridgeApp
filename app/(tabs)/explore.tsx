import {
  deleteItem,
  deleteRecipe,
  getItems,
  getRecipes,
  updateItemQuantity
} from "@/services/db";
import { Item, Recipe } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function TabTwoScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

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
  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      await updateItemQuantity(id, quantity);
      await loadItems(); // what is better design? baar baar load or what?
    } catch (e) {
      Alert.alert("Error", "Failed to delete item");
    }
  }
  const handleDeleteItem = async (id: number) => {
      try {
        await deleteItem(id);
        await loadItems(); // Refresh to show item is gone
      } catch (e) {
        Alert.alert("Error", "Failed to delete item");
      }
    };
    const handleDeleteRecipe = async (id: number) => {
      try {
        await deleteRecipe(id);
        await loadRecipes(); // Refresh to show item is gone
      } catch (e) {
        Alert.alert("Error", "Failed to delete recipe");
      }
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

            <View style={styles.actionRow}>
              {/* DELETE BUTTON - Kept separate for safety */}

              {/* QUANTITY CONTROLS GROUP */}
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(
                      item.id,
                      Math.max(0, item.quantity - 1)
                    )
                  }
                  style={styles.stepperButton}
                >
                  <Ionicons name="remove-outline" size={20} color="#555" />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(item.id, item.quantity + 1)
                  }
                  style={styles.stepperButton}
                >
                  <Ionicons name="add-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item.id)}
              style={[styles.iconButton, styles.deleteItemButton]}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
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
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() =>
              router.push({
                pathname: "/recipe/[id]",
                params: {
                  id: i, // or recipe.id
                  name: recipe.name,
                  ingredients: recipe.ingredients,
                  image_url: recipe.image_url,
                  how_to_cook: recipe.how_to_cook,
                },
              })
            }
          >
            {recipe.image_url && (
              <Image
                source={{ uri: recipe.image_url }}
                style={styles.recipeImage}
              />
            )}
            <View style={styles.recipeInfo}>
              <View style={styles.recipeHeaderRow}>
                <Text style={styles.recipeName} numberOfLines={1}>
                  {recipe.name}
                </Text>
                {/* DELETE BUTTON */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // Prevents the card click from firing
                    handleDeleteRecipe(recipe.id);
                  }}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.recipeIngredientsLabel}>Ingredients:</Text>
              <Text style={styles.recipeIngredients}>{recipe.ingredients}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {recipes.length === 0 && (
          <Text style={styles.emptyText}>No recipes found.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    padding: 6,
    minWidth: 30, // Ensures the touch area is consistent
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FF3B30", // Standard iOS Delete Red
    fontSize: 18,
    fontWeight: "bold",
  },
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
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes delete to one side and quantity to the other
    marginTop: 10,
    width: "100%",
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteItemButton: {
    backgroundColor: "#FFF5F5", // Very light red
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Neutral light grey background
    borderRadius: 12,
    padding: 4,
    width: "100%",
  },
  stepperButton: {
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    // Add a tiny shadow to make buttons "pop" from the grey track
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityText: {
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
  recipeHeaderRow: {
    flexDirection: "row",
    alignItems: "center", // Keeps the X vertically centered with the text
    justifyContent: "space-between",
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
    flex: 1,
    marginRight: 16,
    maxWidth: "70%",
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
