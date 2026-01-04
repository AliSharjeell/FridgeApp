import { Text, View } from "react-native";

export default function ScanScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "red", // 👈 TEMP debug
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 24 }}>Scan Screen</Text>
    </View>
  );
}
