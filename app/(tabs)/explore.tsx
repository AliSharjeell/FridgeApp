import { getItems, Item } from '@/services/db';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const [items, setItems] = useState<Item[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  const loadItems = async () => {
    const data = await getItems('confirmed');
    setItems(data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.appTitle}>Global Properties 🌎</Text>

      <View style={styles.cardPrimary}>
        <Text style={styles.cardTitle}>Inventory</Text>
        <Text style={styles.cardSubtitle}>
          All your confirmed items
        </Text>
      </View>

      <View style={styles.itemsGrid}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image
              source={{ uri: item.image_url || "https://via.placeholder.com/150" }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
          </View>
        ))}
        {items.length === 0 && (
          <Text style={styles.emptyText}>Inventory is empty. Add items from Home!</Text>
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
    fontWeight: "600",
    color: "#111",
    marginBottom: 24,
    marginTop: 20,
  },
  cardPrimary: {
    backgroundColor: "#2196F3", // Blue for Inventory
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
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
    marginBottom: 4,
  },
  itemImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  itemInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    width: "100%",
    textAlign: "center",
    marginTop: 20,
  },
});
