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
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, router } from "expo-router";
import questions from "../questions.json";
import { Ionicons } from "@expo/vector-icons";
import styles from "./gameStyles";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Question {
  id: number;
  category: string;
  question: string;
}

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdIRDSdSJ7hPsc84aAO9yJAZUAF6TTDAY35AC6QYmFsbfRuGw/formResponse";
const ENTRY_IDS = {
  sessionId: "entry.60489562",
  acceptedCards: "entry.1651876338",
  rejectedCards: "entry.738247076",
  categories: "entry.1516522829",
  deviceInfo: "entry.1791082658",
};

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
  const [acceptedCardIds, setAcceptedCardIds] = useState<number[]>([]);
  const [rejectedCardIds, setRejectedCardIds] = useState<number[]>([]);

  // Save data function to be called periodically and on unmount
  const saveData = async () => {
    try {
      const timestamp = new Date().toISOString();
      const sessionId = Math.random().toString(36).substring(2, 15);

      if (Platform.OS !== "web") {
        // Only perform file operations on native platforms
        const dirPath = `${FileSystem.documentDirectory}game_data/`;
        const dirInfo = await FileSystem.getInfoAsync(dirPath);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
        }

        const acceptedPath = `${dirPath}accepted_cards_${timestamp}.json`;
        await FileSystem.writeAsStringAsync(
          acceptedPath,
          JSON.stringify(acceptedCardIds)
        );

        const rejectedPath = `${dirPath}rejected_cards_${timestamp}.json`;
        await FileSystem.writeAsStringAsync(
          rejectedPath,
          JSON.stringify(rejectedCardIds)
        );

        console.log("Data saved locally");
      } else {
        console.log("Skipping file operations on web");
      }

      // Prepare form data
      const formData = new URLSearchParams({
        [ENTRY_IDS.sessionId]: sessionId,
        [ENTRY_IDS.acceptedCards]: JSON.stringify(acceptedCardIds),
        [ENTRY_IDS.rejectedCards]: JSON.stringify(rejectedCardIds),
        [ENTRY_IDS.categories]: JSON.stringify(selectedCategories),
        [ENTRY_IDS.deviceInfo]: JSON.stringify({
          platform: Platform.OS,
          width,
          height,
          timestamp,
        }),
      }).toString();

      // // Submit to Google Form
      // const response = await fetch(`${FORM_URL}?${formData}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      // // });

      // console.log("Data submitted to Google Form");
    } catch (e) {
      console.error("Failed to save or submit data", e);
    }
  };

  // Set up effect to save data when component unmounts
  useEffect(() => {
    return () => {
      if (acceptedCardIds.length > 0 || rejectedCardIds.length > 0) {
        saveData();
      }
    };
  }, [acceptedCardIds, rejectedCardIds]);

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

  // Save data periodically (every 5 swipes)
  useEffect(() => {
    const totalSwipes = acceptedCardIds.length + rejectedCardIds.length;
    if (totalSwipes > 0 && totalSwipes % 5 === 0) {
      saveData();
    }
  }, [acceptedCardIds, rejectedCardIds]);

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "real talk":
        return "rgba(147, 197, 253, 0.85)"; // soft blue
      case "relationships":
        return "rgba(97, 185, 129, 0.85)"; // mint green
      case "sex":
        return "rgba(239, 68, 68, 0.9)"; // toned-down red
      case "dating":
        return "rgba(244, 114, 182, 0.9)"; // rose pink
      default:
        return "#1f2937"; // fallback color
    }
  };

  const handleSwipeComplete = (direction: number) => {
    Animated.timing(pan, {
      toValue: { x: direction * width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!currentCard || remainingCards.length === 0) return;

      if (direction === 1 && currentCard.id !== -1) {
        setAcceptedCardIds((prev) => [...prev, currentCard.id]);
      } else if (currentCard.id !== -1) {
        setRejectedCardIds((prev) => [...prev, currentCard.id]);
      }

      setRemainingCards((prev) => {
        const newDeck =
          direction === -1 ? [...prev.slice(1), prev[0]] : prev.slice(1);

        setCurrentCard(newDeck.length > 0 ? newDeck[0] : null);

        // Navigate to home screen if the final card is swiped
        if (newDeck.length === 0 || newDeck[0]?.id === -1) {
          saveData();
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
        colors={["#0f172a", "#1e293b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      {/* 👇 All content sits ABOVE the hue glows
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={32}
          color="white"
          style={styles.backButton}
          onPress={() => {
            // Save data before navigating back
            if (acceptedCardIds.length > 0 || rejectedCardIds.length > 0) {
              saveData();
            }
            router.back();
          }}
        />
      </View> */}

      <View style={styles.cardContainer}>
        {currentCard ? (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                backgroundColor: getCategoryColor(currentCard.category),
                width: width * 0.9,
                height: height * 0.65,
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
            <Text style={styles.categoryText}>{currentCard.category}</Text>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text style={styles.questionText}>{currentCard.question}</Text>
            </View>
            <Text style={styles.logoText}>awkwrd</Text>
          </Animated.View>
        ) : gameEnded ? null : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>

      <Animated.View style={[styles.footer, { opacity: cardOpacity }]}>
        <Text style={styles.swipeHintText}>← Skip</Text>
        <Text style={styles.swipeHintText}>Swipe</Text>
        <Text style={styles.swipeHintText}>Next →</Text>
      </Animated.View>

      {/* Modal stays on top */}
      <Modal visible={gameEnded} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>
            <Text style={styles.modalText}>
              You've gone through all the questions.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                saveData();
                router.replace("/");
              }}
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
