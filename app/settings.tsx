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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="arrow-back" size={32} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.title}>AWKWRD</Text>
          <Text style={styles.tagline}>The card game that gets real.</Text>
          <Text style={styles.aboutText}>
            AWKWRD is a fun, engaging card game designed to spark meaningful,
            hilarious, and sometimes uncomfortable conversations among friends.
            Pick your categories, answer the questions, and see where the night
            takes you.
          </Text>
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
            onPress={() => router.push("/privacy-policy")}
          >
            <Ionicons name="document-text-outline" size={26} color="white" />
            <Text style={styles.optionText}>Privacy Policy</Text>
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
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 30,
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
