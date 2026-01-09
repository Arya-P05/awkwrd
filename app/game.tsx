import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  useWindowDimensions,
  PanResponder,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import styles from "./gameStyles";
import { LinearGradient } from "expo-linear-gradient";
import { FINAL_CARD } from "../constants/Feedback";
import Header from "../components/Header";

// Import smart deck services
import {
  buildSmartDeck,
  recordSwipe,
  generateQuestionsForCategories,
  CategoryId,
  Question,
  DeckBuildResult,
} from "./services";

// Configuration
const AI_GENERATION_THRESHOLD = 0.8; // Generate new questions when 80% seen
const CARDS_LOW_THRESHOLD = 10; // Start generating when this many cards left
const QUESTIONS_PER_CATEGORY = 5; // How many to generate per category

export default function GameScreen() {
  // Keep the screen awake while playing the game
  useKeepAwake();

  const params = useLocalSearchParams<{ categories?: string }>();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const selectedCategories = params.categories
    ? (params.categories.split(",") as CategoryId[])
    : [];

  const resetPan = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // State
  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [remainingCards, setRemainingCards] = useState<Question[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deckStats, setDeckStats] = useState<DeckBuildResult["stats"] | null>(
    null
  );

  // Silent AI generation tracking
  const [isGenerating, setIsGenerating] = useState(false);
  const hasTriggeredGeneration = useRef(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  // Initialize the smart deck
  useEffect(() => {
    async function initializeDeck() {
      if (!selectedCategories.length) return;

      setIsLoading(true);
      try {
        const result = await buildSmartDeck(selectedCategories);
        const { deck, stats } = result;

        console.log("Smart Deck Built:", {
          total: stats.totalQuestions,
          unseen: stats.unseenQuestions,
          seen: stats.seenQuestions,
          percentageSeen: stats.percentageSeen,
        });

        setDeckStats(stats);

        // If they've already seen 80%+ on initial load, generate more immediately
        if (stats.shouldOfferAI && !hasTriggeredGeneration.current) {
          silentlyGenerateQuestions();
        }

        if (deck.length > 0) {
          setRemainingCards([...deck, FINAL_CARD]);
          setCurrentCard(deck[0]);
        } else {
          // No questions available - try generating or show final card
          if (!hasTriggeredGeneration.current) {
            await silentlyGenerateQuestions();
            // Rebuild after generation
            const newResult = await buildSmartDeck(selectedCategories);
            if (newResult.deck.length > 0) {
              setRemainingCards([...newResult.deck, FINAL_CARD]);
              setCurrentCard(newResult.deck[0]);
              setDeckStats(newResult.stats);
            } else {
              setRemainingCards([FINAL_CARD]);
              setCurrentCard(FINAL_CARD);
            }
          } else {
            setRemainingCards([FINAL_CARD]);
            setCurrentCard(FINAL_CARD);
          }
        }
      } catch (error) {
        console.error("Error building deck:", error);
        setCurrentCard(FINAL_CARD);
      } finally {
        setIsLoading(false);
      }
    }

    initializeDeck();
  }, [params.categories]);

  // Silently generate more questions in the background
  const silentlyGenerateQuestions = useCallback(async () => {
    if (isGenerating || hasTriggeredGeneration.current) return;

    hasTriggeredGeneration.current = true;
    setIsGenerating(true);

    try {
      console.log("Silently generating questions for:", selectedCategories);

      const result = await generateQuestionsForCategories(
        selectedCategories,
        QUESTIONS_PER_CATEGORY
      );

      if (result.success) {
        console.log("Generated", result.totalGenerated, "new questions");

        // Rebuild the deck with new questions
        const newResult = await buildSmartDeck(selectedCategories);
        const { deck, stats } = newResult;

        setDeckStats(stats);

        // Add new cards to current deck seamlessly
        if (deck.length > 0 && currentCard) {
          const currentIds = new Set(remainingCards.map((c) => c.id));
          const newCards = deck.filter(
            (q) => !currentIds.has(q.id) && q.id !== currentCard.id
          );

          if (newCards.length > 0) {
            setRemainingCards((prev) => {
              // Insert new cards before the final card
              const withoutFinal = prev.filter((c) => c.id !== -1);
              return [...withoutFinal, ...newCards, FINAL_CARD];
            });
          }
        }
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCategories, currentCard, remainingCards, isGenerating]);

  // Check if we should generate more questions (runs on deck change)
  useEffect(() => {
    const realCardsLeft = remainingCards.filter((c) => c.id !== -1).length;

    // Trigger generation when running low AND they've seen enough to have preferences
    if (
      realCardsLeft <= CARDS_LOW_THRESHOLD &&
      deckStats?.shouldOfferAI &&
      !hasTriggeredGeneration.current &&
      !isGenerating
    ) {
      silentlyGenerateQuestions();
    }
  }, [
    remainingCards.length,
    deckStats,
    isGenerating,
    silentlyGenerateQuestions,
  ]);

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
      case "chill":
        return "rgba(251, 191, 36, 0.9)";
      case "t/d":
        return "rgba(154, 0, 151, 0.9)";
      default:
        return "#1f2937";
    }
  };

  const handleSwipeComplete = useCallback(
    async (direction: number) => {
      Animated.timing(pan, {
        toValue: { x: direction * width, y: 0 },
        duration: 200,
        useNativeDriver: true,
      }).start(async () => {
        if (!currentCard || remainingCards.length === 0) return;

        // Record the swipe if it's a real card (not the final card)
        // This includes AI-generated questions - their feedback improves future generations
        if (currentCard.id !== -1) {
          const action = direction === 1 ? "liked" : "skipped";

          // Persist the swipe
          try {
            await recordSwipe(
              currentCard.id,
              currentCard.category as CategoryId,
              action,
              currentCard.question.length
            );
          } catch (error) {
            console.error("Error recording swipe:", error);
          }
        }

        setRemainingCards((prev) => {
          // If swiped left (skip), move card to back of deck
          // If swiped right (like), remove card from deck
          const newDeck =
            direction === -1 ? [...prev.slice(1), prev[0]] : prev.slice(1);

          setCurrentCard(newDeck.length > 0 ? newDeck[0] : null);

          if (newDeck.length === 0 || newDeck[0]?.id === -1) {
            setTimeout(() => router.replace("/"), 2000);
          }

          return newDeck;
        });

        pan.setValue({ x: 0, y: 0 });
      });
    },
    [currentCard, remainingCards, width, router, pan]
  );

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

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#0f172a", "#2a3a50"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.background}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: "white", marginTop: 16, fontSize: 16 }}>
            Building your deck...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

      {/* Game Over Modal */}
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
                router.replace("/");
              }}
            >
              <Text style={styles.modalButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Swipe Hue Effects */}
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
