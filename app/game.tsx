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
  const [gameEnded, setGameEnded] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!selectedCategories.length) return;

    const filteredQuestions = questions.filter((q) =>
      selectedCategories.includes(q.category)
    ) as Question[];

    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);

    // Add the final card to the deck
    const finalCard = {
      id: -1,
      category: "",
      question: "Cards finished. \n Taking you back home.",
    };

    console.log("Initializing Game - Total Questions:", shuffled.length + 1);

    setRemainingCards([...shuffled, finalCard]);
    setCurrentCard(shuffled.length > 0 ? shuffled[0] : finalCard);
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
      if (!currentCard || remainingCards.length === 0) return;

      setRemainingCards((prev) => {
        const newDeck =
          direction === -1 ? [...prev.slice(1), prev[0]] : prev.slice(1);

        console.log(
          "AFTER Update - Setting Current Card to:",
          newDeck[0]?.question || "null"
        );

        setCurrentCard(newDeck.length > 0 ? newDeck[0] : null);

        // Navigate to home screen if the final card is swiped
        if (newDeck.length === 0 || newDeck[0]?.id === -1) {
          setTimeout(() => router.replace("/"), 2000);
        }

        return newDeck;
      });

      pan.setValue({ x: 0, y: 0 });
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      // Prevent any movement if the current card is the final card
      if (currentCard?.id === -1) return;

      Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      })(event, gestureState);
    },
    onPanResponderGrant: () => {
      if (currentCard?.id === -1) return;

      Animated.timing(cardOpacity, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: (_, gesture) => {
      // Disable swiping if the current card is the final card
      if (currentCard?.id === -1) {
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 150,
          useNativeDriver: true,
        }).start();
        return;
      }

      const threshold = width * 0.4;
      const velocityThreshold = 1.5;

      if (gesture.dx > threshold || gesture.vx > velocityThreshold) {
        handleSwipeComplete(1);
      } else if (gesture.dx < -threshold || gesture.vx < -velocityThreshold) {
        handleSwipeComplete(-1);
      } else {
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 150,
          useNativeDriver: true,
        }).start();
      }

      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#F09819", "#FF512F"]}
        style={styles.background}
      />

      {/* 👇 All content sits ABOVE the hue glows */}
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
                transform: [
                  { translateX: pan.x },
                  {
                    rotate: pan.x.interpolate({
                      inputRange: [-width, 0, width],
                      outputRange: ["-10deg", "0deg", "10deg"],
                      extrapolate: "clamp",
                    }),
                  },
                ],
                opacity: cardOpacity,
              },
            ]}
          >
            <Text style={styles.categoryText}>
              {currentCard.category.toUpperCase()}
            </Text>
            <Text style={styles.questionText}>{currentCard.question}</Text>
            <Text style={styles.logoText}>awkwrd</Text>
          </Animated.View>
        ) : gameEnded ? null : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.swipeHintText}>← Skip</Text>
        <Text style={styles.swipeHintText}>Swipe</Text>
        <Text style={styles.swipeHintText}>Next →</Text>
      </View>

      {/* Modal stays on top */}
      <Modal visible={gameEnded} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>
            <Text style={styles.modalText}>
              You’ve gone through all the questions.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.modalButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.hue,
          {
            opacity: pan.x.interpolate({
              inputRange: [0, width * 0.5],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            right: -width,
            height: height,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(0, 255, 0, 0.8)", "transparent"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.hue,
          {
            opacity: pan.x.interpolate({
              inputRange: [-width * 0.5, 0],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
            left: -width,
            height: height,
          },
        ]}
      >
        <LinearGradient
          colors={["rgb(255, 0, 0)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.absoluteFill}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
