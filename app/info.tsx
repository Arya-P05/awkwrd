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
        colors={["#F09819", "#FF512F"]}
        style={styles.background}
      />

      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.title}>AWKWRD</Text>
          <Text style={styles.tagline}>The card game that gets real.</Text>
          <Text style={styles.aboutText}>
            AWKWRD is a conversation card game with 140 questions made to deepen
            connections and stimulate memorable moment all while having a good
            time.
          </Text>
          <Text style={styles.aboutText}>
            Don't be afriad to go deep, get personal, and be honest. Ultimately
            it doesn't matter how many cards you get through. The point of the
            game is to engage in meaninful conversations.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How to Play</Text>
          {instructions.map((instruction, index) => {
            if (index === 0) {
              return (
                <View key={index} style={styles.instructionRow}>
                  <Text style={styles.bullet1}>{index + 1}.</Text>
                  <Text style={styles.instruction}>{instruction}</Text>
                </View>
              );
            } else {
              return (
                <View key={index} style={styles.instructionRow}>
                  <Text style={styles.bullet}>{index + 1}.</Text>
                  <Text style={styles.instruction}>{instruction}</Text>
                </View>
              );
            }
          })}
        </View>

        {/* Support & Legal */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>

          <TouchableOpacity style={styles.optionRow} onPress={openEmail}>
            <Ionicons name="mail-outline" size={26} color="white" />
            <Text style={styles.optionText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/terms-of-service")}
          >
            <Ionicons name="document-outline" size={26} color="white" />
            <Text style={styles.optionText}>Terms of Service</Text>
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
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 5,
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
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  bullet: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
  },
  bullet1: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginRight: 9,
  },
  instruction: {
    fontSize: 16,
    color: "white",
    flexShrink: 1,
  },
});
