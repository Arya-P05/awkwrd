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

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="arrow-back" size={24} color="333" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.text}>Last Updated: March 2025</Text>
          <Text style={styles.text}>
            AWKWRD respects your privacy. We do not collect or store any
            personal data. Any gameplay information is kept locally on your
            device and is not shared with third parties.
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
  backButton: {
    marginLeft: 10,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 15,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
});
