import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RecipeDetailScreen() {
  const { id, name, ingredients, image_url, how_to_cook } =
    useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* 1. Hero Image with Gradient Overlay */}
      <ImageBackground
        source={{
          uri: (image_url as string) || "https://via.placeholder.com/300",
        }}
        style={styles.heroImage}
      >
        <SafeAreaView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      {/* 2. Floating Content Card */}
      <View style={styles.contentCard}>
        <View style={styles.dragHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
        >
          <Text style={styles.categoryLabel}>PREMIUM RECIPE</Text>
          <Text style={styles.mainTitle}>
            {name?.toString().split(" ")[0]}{" "}
            <Text style={{ fontWeight: "900" }}>
              {name?.toString().split(" ").slice(1).join(" ")}
            </Text>
          </Text>

          {/* 3. Quick Info Bar */}
          <View style={styles.infoRow}>
            <InfoItem icon="time-outline" label="35 mins" />
            <InfoItem icon="flame-outline" label="Medium" />
            <InfoItem icon="people-outline" label="2 Servings" />
          </View>

          {/* 4. Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="basket-outline" size={20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Ingredients</Text>
            </View>
            <View style={styles.whiteCard}>
              <Text style={styles.bodyText}>{ingredients}</Text>
            </View>
          </View>

          {/* 5. Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant-outline" size={20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            <View style={styles.whiteCard}>
              <Text style={styles.bodyText}>
                {how_to_cook || "Step-by-step guide coming soon..."}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

// Helper component for the metadata row
function InfoItem({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color="#666" />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#000" },
  heroImage: { width: "100%", height: 350 },
  backButton: {
    marginLeft: 20,
    marginTop: 10,
    height: 45,
    width: 45,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -60, // Deep overlap for modern feel
    paddingTop: 15,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#CCC",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  scrollPadding: { padding: 25 },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF9800",
    letterSpacing: 1,
    marginBottom: 5,
  },
  mainTitle: { fontSize: 32, color: "#1A1A1A", marginBottom: 20 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 15,
    borderRadius: 20,
  },
  infoItem: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 6, color: "#666", fontSize: 13, fontWeight: "500" },
  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    color: "#333",
  },
  whiteCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bodyText: { fontSize: 15, color: "#444", lineHeight: 24 },
});
