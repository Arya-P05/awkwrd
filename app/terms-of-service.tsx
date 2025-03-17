"use client";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/settings")} // Dynamically go back
        >
          <Ionicons name="arrow-back" size={24} color="333" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.text}>Last Updated: March 2025</Text>
          <Text style={styles.text}>
            By using AWKWRD, you agree to play responsibly and in good faith.
            This game is for entertainment purposes only. We do not collect user
            data or store any information beyond your local device.
          </Text>
          <Text style={styles.text}>
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
    backgroundColor: "#f8f8f8",
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6a0dad",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  backButton: {
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 16,
  },
});
