import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type HeaderProps = {
  onBack?: () => void | Promise<void>;
};

export default function Header({ onBack }: HeaderProps) {
  const router = useRouter();

  const handleBack = async () => {
    if (onBack) {
      await onBack(); // supports async functions like saveData
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.button}>
        <Ionicons name="chevron-back-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.7,
  },
  button: {
    padding: 8,
  },
});
