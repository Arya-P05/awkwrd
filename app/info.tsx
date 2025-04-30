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
import Header from "@/components/Header";

const instructions = [
  "Pick the categories you're in the mood for. Real talk? Dating? Something spicier?",
  "Take turns answering and only 1 skip allowed per person.",
  "There’s no winning or losing—just unexpected conversations and hopefully some new inside jokes.",
];

export default function SettingsScreen() {
  const router = useRouter();

  const openEmail = () => {
    Linking.openURL("mailto:arya.patel2354@gmail.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#2a3a50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.aboutTitle}>AWKWRD</Text>
          <Text style={styles.tagline}>
            People you know. Stories you don't.
          </Text>
          <Text style={styles.aboutText}>
            A conversation card game with 140 questions made to deepen
            connections and stimulate memorable moments.
          </Text>
          <Text style={styles.aboutText}>
            Don't be afriad to go deep, get personal, and be honest. Ultimately
            it doesn't matter how many cards you get through. The point is
            having true conversations.
          </Text>
        </View>

        {/* Term of Service Section */}
        <View style={styles.card}>
          <View style={styles.tosHeader}>
            <Ionicons name="document-outline" size={26} color="white" />
            <Text style={styles.tosTitle}>Terms of Service</Text>
          </View>
          <Text style={styles.tagline}>Last Updated: March 2025</Text>
          <Text style={styles.aboutText}>
            AWKWRD is for 18 or older and entertainment purposes only. Any
            gameplay or personal information is not shared with third parties.
          </Text>
          <Text style={styles.aboutText}>
            You agree NOT to copy, modify, or distribute AWKWRD without
            permission.
          </Text>
        </View>

        {/* Support & Legal */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.optionRow} onPress={openEmail}>
            <Ionicons name="mail-outline" size={26} color="white" />
            <Text style={styles.optionText}>Contact Support</Text>
          </TouchableOpacity>
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
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 15,
  },
  tosHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginLeft: 10,
  },
  card: {
    // backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
    padding: 20,
    marginVertical: 5,
    width: "85%",
    elevation: 5,
  },
  aboutTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 2,
  },
  tosTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 2,
    marginLeft: 8,
  },
  tagline: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  aboutText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 10,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "white",
    fontWeight: "500",
  },
});
