import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  useWindowDimensions,
  PanResponder,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import questions from "../questions.json";
import { Ionicons } from "@expo/vector-icons";
import styles from "./gameStyles";
import { LinearGradient } from "expo-linear-gradient";

interface Question {
  id: number;
  category: string;
  question: string;
}

export default function GameScreen() {
  const params = useLocalSearchParams<{ categories?: string }>();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const selectedCategories = params.categories
    ? params.categories.split(",")
    : [];

  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [remainingCards, setRemainingCards] = useState<Question[]>([]);
  const [gameEnded, setGameEnded] = useState(false); // NEW: Track game over
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    if (!selectedCategories.length) return;

    const filteredQuestions = questions.filter((q) =>
      selectedCategories.includes(q.category)
    ) as Question[];

    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);

    setRemainingCards(shuffled);
    setCurrentCard(shuffled.length > 0 ? shuffled[0] : null);
  }, [params.categories]);

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "real talk":
        return "rgb(0, 158, 249)";
      case "relationships":
        return "rgba(47, 213, 69, 0.87)";
      case "sex":
        return "rgba(240, 22, 22, 0.89)";
      case "dating":
        return "rgba(236, 57, 195, 0.88)";
      default:
        return "#6a0dad";
    }
  };

  const handleSwipeComplete = (direction: number) => {
    Animated.timing(pan, {
      toValue: { x: direction * width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setRemainingCards((prev) => {
        if (!currentCard) return prev;

        let newDeck = prev.slice(1); // Remove swiped card

        setCurrentCard(newDeck.length > 0 ? newDeck[0] : null);

        // 🚀 Delay setting gameEnded so swipe animation fully completes
        if (newDeck.length === 0) {
          setTimeout(() => setGameEnded(true), 200);
        }

        return newDeck;
      });

      pan.setValue({ x: 0, y: 0 });
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        handleSwipeComplete(1);
      } else if (gesture.dx < -120) {
        handleSwipeComplete(-1);
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#F09819", "#FF512F"]}
        style={styles.background}
      />

      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={32}
          color="white"
          style={styles.backButton}
          onPress={() => router.back()}
        />
      </View>

      <View style={styles.cardContainer}>
        {currentCard ? (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                backgroundColor: getCategoryColor(currentCard.category),
                width: width * 0.9,
                height: height * 0.6,
                transform: [{ translateX: pan.x }],
                opacity: pan.x.interpolate({
                  inputRange: [-width, 0, width],
                  outputRange: [0, 1, 0], // Fades out as it moves
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={styles.categoryText}>
              {currentCard.category.toUpperCase()}
            </Text>
            <Text style={styles.questionText}>{currentCard.question}</Text>
            <Text style={styles.logoText}>awkwrd</Text>
          </Animated.View>
        ) : null}
      </View>

      {/* Subtle Swipe Hints */}
      <View style={styles.footer}>
        <Text style={styles.swipeHintText}>← Skip</Text>
        <Text style={styles.swipeHintText}>Swipe</Text>
        <Text style={styles.swipeHintText}>Next →</Text>
      </View>

      {/* NEW: End Game Modal */}
      <Modal visible={gameEnded} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>
            <Text style={styles.modalText}>
              You’ve gone through all the questions.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => router.replace("/")} // Navigate to home
            >
              <Text style={styles.modalButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
