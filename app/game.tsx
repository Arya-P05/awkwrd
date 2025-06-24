import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Header from "../components/Header";
import { ENTRY_IDS, FINAL_CARD, FORM_URL } from "../constants/Feedback";
import questions from "../questions.json";
import styles from "./gameStyles";

interface Question {
  id: number;
  category: string;
  question: string;
}

const SAVE_THRESHOLDS = [10, 25, 50];

export default function GameScreen() {
  const params = useLocalSearchParams<{ categories?: string }>();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const selectedCategories = params.categories
    ? params.categories.split(",")
    : [];

  const resetPan = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // State variables
  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [remainingCards, setRemainingCards] = useState<Question[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [acceptedCardIds, setAcceptedCardIds] = useState<number[]>([]);
  const [rejectedCardIds, setRejectedCardIds] = useState<number[]>([]);
  const [saveMilestones, setSaveMilestones] = useState<number[]>([]);

  const pan = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const saveData = async (
    accepted: number[] = acceptedCardIds,
    rejected: number[] = rejectedCardIds
  ) => {
    try {
      const timestamp = new Date().toISOString();
      const sessionId = Math.random().toString(36).substring(2, 15);

      if (Platform.OS !== "web") {
        const dirPath = `${FileSystem.documentDirectory}game_data/`;
        const dirInfo = await FileSystem.getInfoAsync(dirPath);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
        }

        const acceptedPath = `${dirPath}accepted_cards_${timestamp}.json`;
        await FileSystem.writeAsStringAsync(
          acceptedPath,
          JSON.stringify(accepted)
        );

        const rejectedPath = `${dirPath}rejected_cards_${timestamp}.json`;
        await FileSystem.writeAsStringAsync(
          rejectedPath,
          JSON.stringify(rejected)
        );

        console.log("Data saved locally");
      } else {
        console.log("Skipping file operations on web");
      }

      const formData = new URLSearchParams({
        [ENTRY_IDS.sessionId]: sessionId,
        [ENTRY_IDS.acceptedCards]: JSON.stringify(accepted),
        [ENTRY_IDS.rejectedCards]: JSON.stringify(rejected),
        [ENTRY_IDS.categories]: JSON.stringify(selectedCategories),
        [ENTRY_IDS.deviceInfo]: JSON.stringify({
          platform: Platform.OS,
          width,
          height,
          timestamp,
        }),
      }).toString();

      await fetch(`${FORM_URL}?${formData}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log("Data submitted to Google Form");
    } catch (e) {
      console.error("Failed to save or submit data", e);
    }
  };

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

    console.log("Initializing Game - Total Questions:", shuffled.length + 1);

    setRemainingCards([...shuffled, FINAL_CARD]);
    setCurrentCard(shuffled.length > 0 ? shuffled[0] : FINAL_CARD);
  }, [params.categories]);

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "real talk":
        return "rgba(147, 197, 253, 0.85)";
      case "relationships":
        return "rgba(97, 185, 129, 0.85)";
      case "sex":
        return "rgba(239, 68, 68, 0.9)";
      case "dating":
        return "rgba(244, 114, 182, 0.9)";
      default:
        return "#1f2937";
    }
  };

  const handleSwipeComplete = (direction: number) => {
    Animated.timing(pan, {
      toValue: { x: direction * width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!currentCard || remainingCards.length === 0) return;

      let newAccepted = acceptedCardIds;
      let newRejected = rejectedCardIds;

      if (direction === 1 && currentCard.id !== -1) {
        newAccepted = [...acceptedCardIds, currentCard.id];
        setAcceptedCardIds(newAccepted);
      } else if (currentCard.id !== -1) {
        newRejected = [...rejectedCardIds, currentCard.id];
        setRejectedCardIds(newRejected);
      }

      const totalSwipes = newAccepted.length + newRejected.length;

      if (
        SAVE_THRESHOLDS.includes(totalSwipes) &&
        !saveMilestones.includes(totalSwipes)
      ) {
        saveData(newAccepted, newRejected);
        setSaveMilestones((prev) => [...prev, totalSwipes]);
      }

      setRemainingCards((prev) => {
        const newDeck =
          direction === -1 ? [...prev.slice(1), prev[0]] : prev.slice(1);

        setCurrentCard(newDeck.length > 0 ? newDeck[0] : null);

        if (newDeck.length === 0 || newDeck[0]?.id === -1) {
          saveData(newAccepted, newRejected);
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
      if (currentCard?.id === -1) {
        resetPan();
        return;
      }

      const threshold = width * 0.4;
      const velocityThreshold = 1.5;

      if (gesture.dx > threshold || gesture.vx > velocityThreshold) {
        handleSwipeComplete(1);
      } else if (gesture.dx < -threshold || gesture.vx < -velocityThreshold) {
        handleSwipeComplete(-1);
      } else {
        resetPan();
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
        colors={["#0f172a", "#2a3a50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      <Header
        onBack={async () => {
          console.log("Back button pressed");
          if (acceptedCardIds.length > 0 || rejectedCardIds.length > 0) {
            await saveData();
            console.log("Data saved before going back");
          }
          router.back();
        }}
      />

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
            <View style={styles.cardContent}>
              <Text style={styles.questionText}>{currentCard.question}</Text>
            </View>
            <Text style={styles.logoText}>awkwrd</Text>
          </Animated.View>
        ) : gameEnded ? null : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>

      <Animated.View style={styles.footer}>
        <Text style={styles.swipeHintText}>← Skip</Text>
        <Text style={styles.swipeHintText}>Swipe</Text>
        <Text style={styles.swipeHintText}>Next →</Text>
      </Animated.View>

      <Modal visible={gameEnded} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>
            <Text style={styles.modalText}>
              You&apos;ve gone through all the questions.
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
