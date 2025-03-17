import { Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { CategoryProvider } from "../app/context/categoryContext";

export default function Layout() {
  return (
    <CategoryProvider>
      <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </CategoryProvider>
  );
}
