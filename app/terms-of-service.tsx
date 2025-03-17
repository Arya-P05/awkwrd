"use client";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#F09819", "#FF512F"]}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.tagline}>Last Updated: March 2025</Text>
          <Text style={styles.aboutText}>
            By using AWKWRD, you agree to play responsibly and in good faith.
            This game is for entertainment purposes only. We do not collect user
            data or store any information beyond your local device.
          </Text>
          <Text style={styles.aboutText}>
            AWKWRD is not liable for any awkward conversations, broken
            friendships, or embarrassing revelations that may occur.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    width: "85%",
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "left",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 5,
    textAlign: "left",
    fontStyle: "italic",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: "white",
    textAlign: "left",
    marginTop: 10,
    opacity: 0.9,
  },
});
