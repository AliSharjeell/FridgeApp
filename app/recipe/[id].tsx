import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
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
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Hero Image */}
      <Image
        source={{
          uri: (image_url as string) || "https://via.placeholder.com/300",
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.bodyText}>{ingredients}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.bodyText}>
            {how_to_cook || "No instructions provided for this recipe."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    borderRadius: 20,
  },
  image: { width: "100%", height: 300, resizeMode: "cover" },
  content: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: "white",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF9800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  bodyText: { fontSize: 16, color: "#555", lineHeight: 24 },
});
