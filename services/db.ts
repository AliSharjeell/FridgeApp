import { Item, Recipe } from "@/types";
import * as SQLite from "expo-sqlite";


export const db = SQLite.openDatabaseSync("kitchen.db");

export const initDB = async () => {
    try {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image_url TEXT,
        quantity INTEGER,
        status TEXT DEFAULT 'draft'
      );
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image_url TEXT,
        ingredients TEXT,
        how_to_cook TEXT
      );
    `);
        // Migration support for existing tables without status
        try {
            await db.execAsync("ALTER TABLE items ADD COLUMN status TEXT DEFAULT 'draft'");
        } catch (e) {
            // Include a comment or log for ignored error
            console.log("Column 'status' likely exists or error adding it:", e);
        }

        console.log("DB initialized");
    } catch (error) {
        console.log("DB init error", error);
        throw error;
    }
};
// services/db.ts
export const saveRecipe = (recipe: Recipe) => {
  const ingredientsStr = recipe.ingredients.join(", ");
  try {
    db.runAsync(
      `INSERT INTO recipes (name, image_url, ingredients, how_to_cook) VALUES (?, ?, ?, ?)`,
      [
        recipe.name,
        recipe.image_url || "",
        ingredientsStr,
        recipe.how_to_cook || "",
      ]
    );
    console.log("Recipe saved:", recipe.name);
  } catch (error) {
    console.error("Error saving recipe:", error);
  }
};
export const getRecipes = async (
): Promise<Recipe[]> => {
  try {
    const result = await db.getAllAsync<Recipe>(
      "SELECT * FROM recipes"
    );
    return result;
  } catch (error) {
    console.error("Error getting recipes:", error);
    return [];
  }
};


export const addItem = async (name: string, quantity: number, image_url: string = "") => {
    try {
        await db.runAsync(
            "INSERT INTO items (name, quantity, image_url, status) VALUES (?, ?, ?, 'draft')",
            [name, quantity, image_url]
        );
        console.log(`Added item: ${name}`);
    } catch (error) {
        console.error("Error adding item:", error);
        throw error;
    }
};

export const getItems = async (status: 'draft' | 'confirmed'): Promise<Item[]> => {
    try {
        const result = await db.getAllAsync<Item>("SELECT * FROM items WHERE status = ?", [status]);
        return result;
    } catch (error) {
        console.error("Error getting items:", error);
        return [];
    }
};

export const updateItemStatus = async (id: number, status: 'draft' | 'confirmed') => {
    try {
        await db.runAsync("UPDATE items SET status = ? WHERE id = ?", [status, id]);
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

export const confirmAllItems = async () => {
    try {
        await db.runAsync("UPDATE items SET status = 'confirmed' WHERE status = 'draft'");
    } catch (error) {
        console.error("Error confirming all items:", error);
        throw error;
    }
};

export const deleteItem = async (id: number) => {
    try {
        await db.runAsync("DELETE FROM items WHERE id = ?", [id]);
        console.log(`Deleted item id: ${id}`);
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
};
