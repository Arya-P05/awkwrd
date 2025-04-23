"use client";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCategory } from "../app/context/categoryContext";

const screenWidth = Dimensions.get("window").width;
const boxSize = screenWidth > 768 ? screenWidth * 0.22 : screenWidth * 0.4;
const maxBoxSize = 160;

type CategoryId = "real talk" | "relationships" | "sex" | "dating";

const CATEGORIES: {
  id: CategoryId;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  colour: string;
}[] = [
  {
    id: "real talk",
    name: "Real Talk",
    icon: "chatbubble-ellipses-outline",
    colour: "rgba(147, 197, 253, 0.85)",
  },
  {
    id: "relationships",
    name: "Relationships",
    icon: "heart-outline",
    colour: "rgba(97, 185, 129, 0.85)",
  },
  {
    id: "sex",
    name: "Sex",
    icon: "flame-outline",
    colour: "rgba(239, 68, 68, 0.9)",
  },
  {
    id: "dating",
    name: "Dating",
    icon: "people-outline",
    colour: "rgba(244, 114, 182, 0.9)",
  },
];

export default function CategorySelectionScreen() {
  const router = useRouter();
  const { selectedCategories, toggleCategory } = useCategory();
  const [modalVisible, setModalVisible] = useState(false);
  const activeCategories = Object.keys(selectedCategories).filter(
    (key) => selectedCategories[key as CategoryId]
  );

  const startGame = () => {
    if (activeCategories.length === 0) {
      return;
    }

    router.push(`/game?categories=${activeCategories.join(",")}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#1e293b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "#0f172a" }}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        {/* <Ionicons name="arrow-back" size={32} color="white" /> */}
        <Ionicons name="chevron-back-outline" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Select Categories</Text>
        <Text style={styles.subtitle}>Pick at least one to get started.</Text>
      </View>

      <View style={styles.categoryGrid}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryBox,
              {
                backgroundColor: selectedCategories[category.id]
                  ? category.colour
                  : "rgba(255, 255, 255, 0.1)",
                opacity: selectedCategories[category.id] ? 0.85 : 0.6,
                width: Math.min(boxSize, maxBoxSize),
                height: Math.min(boxSize, maxBoxSize),
              },
            ]}
            onPress={() => toggleCategory(category.id)}
          >
            <Ionicons name={category.icon} size={30} color="white" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          activeCategories.length === 0 && {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          activeCategories.length > 0 && {
            backgroundColor: "white",
          },
        ]}
        onPress={activeCategories.length > 0 ? startGame : undefined} // Disable press if no categories are selected
      >
        <Text
          style={[
            styles.startButtonText,
            activeCategories.length === 0 && {
              color: "white",
              opacity: 0.5,
            },
            activeCategories.length > 0 && {
              color: "black",
            },
          ]}
        >
          Start Game
        </Text>
      </TouchableOpacity>

      {/* Modal for no category selected */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Oops</Text>
            <Text style={styles.modalText}>
              You need to pick at least one category before starting the game.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  background: { ...StyleSheet.absoluteFillObject },
  header: { alignItems: "center", marginBottom: 30, paddingHorizontal: 20 },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.25,
  },
  subtitle: { fontSize: 16, color: "#ddd", textAlign: "center", marginTop: 5 },
  categoryGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
  },
  categoryBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  categoryText: { fontSize: 18, fontWeight: "600", color: "white" },
  startButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: { position: "absolute", top: 60, left: 20, padding: 12 },
  categoryIcon: { marginBottom: 10 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FF512F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
