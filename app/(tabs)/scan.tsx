import { useImagePreview } from "@/context/ImagePreviewContext";
import { addItem } from "@/services/db";
import { sendImageToGroq } from "@/services/groqImage";
import { searchItemImage } from "@/services/imageSearch";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1. Define the interface for your scanned items
interface ScannedItem {
  name: string;
  quantity: number | string;
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { setPreviewImage } = useImagePreview();

  const [zoom, setZoom] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);

  // 2. Properly type the state to avoid the 'never' error
  const [aiResponse, setAiResponse] = useState<ScannedItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        if (photoData && photoData.base64) {
          setPhoto(photoData.uri);
          setLoading(true);

          try {
            const result = await sendImageToGroq(photoData.base64);

            // 3. Clean Markdown before parsing (AI often wraps JSON in ```json blocks)
            const cleanJson = result
              .replace(/```json/g, "")
              .replace(/```/g, "")
              .trim();
            const parsedData = JSON.parse(cleanJson);

            // 4. Extract array and save to state
            const items = (parsedData.items || parsedData) as ScannedItem[];
            setAiResponse(Array.isArray(items) ? items : []);
          } catch (error) {
            console.error("Groq analysis error:", error);
            Alert.alert(
              "Analysis Failed",
              "Could not read the items in the image."
            );
            setAiResponse([]);
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  const saveItems = async () => {
    if (aiResponse.length === 0) return;

    try {
      setSaving(true);

      // 5. Logic Fixed: No more .replace() or JSON.parse() here!
      // aiResponse is already a clean array of objects.
      for (const item of aiResponse) {
        const imageUrl = await searchItemImage(item.name);

        // Ensure quantity is a valid number
        const qty =
          typeof item.quantity === "string"
            ? parseInt(item.quantity) || 1
            : item.quantity;

        await addItem(item.name, qty, imageUrl);
      }

      Alert.alert("Success", "Items saved to your fridge!");
      setPhoto(null);
      setAiResponse([]);
    } catch (error) {
      console.error("Error saving items:", error);
      Alert.alert("Error", "Failed to save items.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Analyzing Items...</Text>
            </View>
          )}

          {!loading && aiResponse.length > 0 && (
            <View style={styles.overlayWrapper}>
              <ScrollView style={styles.responseContainer}>
                <Text style={styles.listHeader}>Items Found:</Text>
                {aiResponse.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>
                        Quantity: {item.quantity}
                      </Text>
                    </View>
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#4CAF50"
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.previewControls}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={saveItems}
                  disabled={saving}
                >
                  <Text style={styles.buttonText}>
                    {saving ? "Saving..." : "Save to Fridge"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.retakeButton]}
                  onPress={() => {
                    setPhoto(null);
                    setAiResponse([]);
                  }}
                  disabled={saving}
                >
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          mode="picture"
          zoom={zoom}
        >
          <View style={styles.controlsContainer}>
            <View style={styles.zoomControls}>
              <TouchableOpacity
                onPress={() => setZoom(Math.max(0, zoom - 0.1))}
                style={styles.zoomButton}
              >
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.zoomText}>{(zoom * 10 + 1).toFixed(1)}x</Text>
              <TouchableOpacity
                onPress={() => setZoom(Math.min(1, zoom + 0.1))}
                style={styles.zoomButton}
              >
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  message: { textAlign: "center", color: "white" },

  // Preview / Analysis UI
  previewContainer: { flex: 1 },
  preview: { flex: 1, resizeMode: "cover" },
  overlayWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  responseContainer: { paddingHorizontal: 20 },
  listHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  itemQuantity: { color: "#bbb", fontSize: 14 },

  // Controls
  controlsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
  },
  zoomControls: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
    padding: 10,
  },
  zoomButton: { paddingHorizontal: 20 },
  zoomText: { color: "white", fontSize: 18, fontWeight: "bold" },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },

  previewControls: {
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: { backgroundColor: "#4CAF50" },
  retakeButton: { backgroundColor: "#FF3B30" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
  },
});
