import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    soundEffects: true,
    vibration: true,
    timerEnabled: false,
    familyFriendly: false,
  });

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const resetGame = () => {
    Alert.alert(
      "Reset Game",
      "Are you sure you want to reset all game data? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => {
            // Reset logic would go here
            Alert.alert("Success", "Game data has been reset.");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={() => toggleSetting("soundEffects")}
              trackColor={{ false: "#767577", true: "#6a0dad" }}
              thumbColor={settings.soundEffects ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Vibration</Text>
            </View>
            <Switch
              value={settings.vibration}
              onValueChange={() => toggleSetting("vibration")}
              trackColor={{ false: "#767577", true: "#6a0dad" }}
              thumbColor={settings.vibration ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Timer</Text>
            </View>
            <Switch
              value={settings.timerEnabled}
              onValueChange={() => toggleSetting("timerEnabled")}
              trackColor={{ false: "#767577", true: "#6a0dad" }}
              thumbColor={settings.timerEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Family Friendly Mode</Text>
              <Text style={styles.settingDescription}>
                Filters out mature content
              </Text>
            </View>
            <Switch
              value={settings.familyFriendly}
              onValueChange={() => toggleSetting("familyFriendly")}
              trackColor={{ false: "#767577", true: "#6a0dad" }}
              thumbColor={settings.familyFriendly ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Version 1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reset Game Data</Text>
        </TouchableOpacity>
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
    padding: 15,
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  aboutRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  aboutText: {
    fontSize: 16,
    color: "#333",
  },
  resetButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 10,
    margin: 15,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
