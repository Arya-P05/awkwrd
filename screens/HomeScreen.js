import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Image,
} from "react-native";

const CATEGORIES = [
  { id: "realTalk", name: "Real Talk", color: "#4CAF50" },
  { id: "relationships", name: "Relationships", color: "#2196F3" },
  { id: "sex", name: "Sex", color: "#F44336" },
  { id: "dating", name: "Dating", color: "#FF9800" },
];

export default function HomeScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState({
    realTalk: true,
    relationships: true,
    sex: true,
    dating: true,
  });

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const startGame = () => {
    const activeCategories = Object.entries(selectedCategories)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (activeCategories.length === 0) {
      alert("Please select at least one category to play");
      return;
    }

    navigation.navigate("Game", { categories: activeCategories });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AWKWRD</Text>
        <Text style={styles.subtitle}>The card game that gets real</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Select Categories</Text>

        {CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categoryRow}>
            <View
              style={[styles.categoryIcon, { backgroundColor: category.color }]}
            />
            <Text style={styles.categoryName}>{category.name}</Text>
            <Switch
              value={selectedCategories[category.id]}
              onValueChange={() => toggleCategory(category.id)}
              trackColor={{ false: "#767577", true: category.color }}
              thumbColor={
                selectedCategories[category.id] ? "#f4f3f4" : "#f4f3f4"
              }
            />
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>START GAME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#6a0dad",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  categoriesContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 15,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#6a0dad",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsButton: {
    marginTop: 20,
    padding: 10,
  },
  settingsButtonText: {
    color: "#6a0dad",
    fontSize: 16,
  },
});
