import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
export default function HomeScreen() {
    const [saved, setSaved] = useState(false);
      const [edit, setEdit] = useState(false);
const [items, setItems] = useState("View detected ingredients");
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.appTitle}>FridgeScan 🧊</Text>

      {/* Scan Section */}
      <View style={styles.cardPrimary}>
        <Text style={styles.cardTitle}>Scan</Text>
        <Text style={styles.cardSubtitle}>
          Take a photo of your fridge or food
        </Text>
      </View>

      {/* Items Section */}
      <View style={styles.cardRow}>
        {/* Left content */}
        <View>
          <Text style={styles.cardTitle}>Items</Text>
          {edit ? (
            <>
              <TextInput
                value={items}
                onChangeText={setItems}
                style={styles.cardSubtitleInput}
              />
            </>
          ) : (
            <>
              <Text style={styles.cardSubtitle}>{items}</Text>
            </>
          )}
        </View>

        {/* Save button */}
        <View
          style={{
            flexDirection: "row",
            gap: 6,
          }}
        >
          <Pressable onPress={() => setEdit(!edit)}>
            <Ionicons
              name="pencil"
              size={24}
              color={edit ? "#4CAF50" : "#666"}
            />
          </Pressable>
          <Pressable onPress={() => setSaved(!saved)}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={saved ? "#4CAF50" : "#666"}
            />
          </Pressable>
        </View>
      </View>

      {/* Recipes Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recipes</Text>
        <Text style={styles.cardSubtitle}>Get meal ideas from your items</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  cardTitleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  cardSubtitleInput: {
    fontSize: 14,
    color: "#666",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    marginBottom: 24,
  },

  cardPrimary: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  cardRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
