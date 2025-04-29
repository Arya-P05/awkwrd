"use client";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCategory } from "./context/categoryContext";

export default function HomeScreen() {
  const router = useRouter();
  const { selectedCategories } = useCategory();
  const [showModal, setShowModal] = useState(false);

  const startGame = () => {
    const activeCategories = Object.keys(selectedCategories).filter(
      (key) => selectedCategories[key as keyof typeof selectedCategories]
    );

    if (activeCategories.length === 0) {
      router.push(`/categories`);
      return;
    }

    router.push(`/game?categories=${activeCategories.join(",")}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#2a3a50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      <View style={styles.content}>
        <Text style={styles.title}>AWKWRD</Text>
        <Text style={styles.subtitle}>People you know. Stories you don't.</Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>START GAME</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/categories")}
      >
        <Ionicons name="game-controller-outline" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => router.push("/info")}
      >
        <Ionicons name="information-circle-outline" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Categories</Text>
            <Text style={styles.modalText}>
              You need to pick at least one category before starting the game.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowModal(false);
                router.push("/categories");
              }}
            >
              <Text style={styles.modalButtonText}>Pick Categories</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6a0dad",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 5,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 50,
    elevation: 5,
  },
  startButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 20,
  },
  infoButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 20,
  },
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
