import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    console.log("Attempting to take picture...");
    if (cameraRef.current) {
      try {
        console.log("Calling takePictureAsync...");
        const photoData = await cameraRef.current.takePictureAsync();
        console.log("takePictureAsync result:", photoData);
        if (photoData) {
          setPhoto(photoData.uri);
          console.log("Photo captured:", photoData.uri);
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    } else {
      console.warn("Camera ref is null");
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.previewControls}>
            <Button title="Retake" onPress={() => setPhoto(null)} />
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          mode="picture"
          onCameraReady={() => console.log("Camera ready")}
          onMountError={(e) => console.error("Camera mount error:", e)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  previewControls: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
