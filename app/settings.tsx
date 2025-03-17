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

export default function SettingsScreen() {
  const router = useRouter();

  const openEmail = () => {
    Linking.openURL("mailto:arya.patel2354@gmail.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.title}>AWKWRD</Text>
          <Text style={styles.tagline}>The card game that gets real.</Text>
          <Text style={styles.aboutText}>
            AWKWRD is a fun and engaging card game designed to spark meaningful,
            hilarious, and sometimes uncomfortable conversations among friends.
            Pick your categories, answer the questions, and see where the night
            takes you.
          </Text>
        </View>

        {/* About & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>

          <TouchableOpacity style={styles.optionRow} onPress={openEmail}>
            <Ionicons name="mail-outline" size={24} color="#6a0dad" />
            <Text style={styles.optionText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/privacy-policy")}
          >
            <Ionicons name="document-text-outline" size={24} color="#6a0dad" />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/terms-of-service")}
          >
            <Ionicons name="document-outline" size={24} color="#6a0dad" />
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
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 15,
    padding: 20,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6a0dad",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 5,
  },
  aboutText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});
