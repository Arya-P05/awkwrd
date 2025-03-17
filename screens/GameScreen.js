import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { questions } from "../data/questions";

const { width } = Dimensions.get("window");

export default function GameScreen({ route, navigation }) {
  const { categories } = route.params;

  const [currentCard, setCurrentCard] = useState(null);
  const [remainingCards, setRemainingCards] = useState([]);
  const [animation] = useState(new Animated.Value(0));
  const [cardRotation] = useState(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter questions based on selected categories
  useEffect(() => {
    const filteredQuestions = questions.filter((q) =>
      categories.includes(q.category)
    );

    // Shuffle the questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);

    if (shuffled.length > 0) {
      setCurrentCard(shuffled[0]);
      setRemainingCards(shuffled.slice(1));
    }
  }, [categories]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "realTalk":
        return "#4CAF50";
      case "relationships":
        return "#2196F3";
      case "sex":
        return "#F44336";
      case "dating":
        return "#FF9800";
      default:
        return "#6a0dad";
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "realTalk":
        return "Real Talk";
      case "relationships":
        return "Relationships";
      case "sex":
        return "Sex";
      case "dating":
        return "Dating";
      default:
        return category;
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.spring(cardRotation, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const nextCard = () => {
    if (remainingCards.length === 0) {
      alert("No more cards! Game over.");
      navigation.navigate("Home");
      return;
    }

    // Reset flip state
    setIsFlipped(false);
    cardRotation.setValue(0);

    // Animate card out to the right
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Set new card and reset animation
      setCurrentCard(remainingCards[0]);
      setRemainingCards(remainingCards.slice(1));
      animation.setValue(0);
    });
  };

  const skipCard = () => {
    if (remainingCards.length === 0) {
      alert("No more cards! Game over.");
      navigation.navigate("Home");
      return;
    }

    // Reset flip state
    setIsFlipped(false);
    cardRotation.setValue(0);

    // Animate card out to the left
    Animated.timing(animation, {
      toValue: -1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Move current card to the end of the deck
      const newDeck = [...remainingCards, currentCard];
      setCurrentCard(newDeck[0]);
      setRemainingCards(newDeck.slice(1));
      animation.setValue(0);
    });
  };

  // Card animation styles
  const cardTranslate = animation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width, 0, width],
  });

  const frontRotation = cardRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = cardRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = cardRotation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = cardRotation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading cards...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: cardTranslate },
                { rotateY: frontRotation },
              ],
              opacity: frontOpacity,
              backgroundColor: getCategoryColor(currentCard.category),
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.categoryText}>
              {getCategoryName(currentCard.category)}
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.questionText}>{currentCard.question}</Text>
          </View>

          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            <Text style={styles.flipButtonText}>Tap to flip</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [
                { translateX: cardTranslate },
                { rotateY: backRotation },
              ],
              opacity: backOpacity,
              backgroundColor: getCategoryColor(currentCard.category),
            },
            { position: "absolute" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.categoryText}>
              {getCategoryName(currentCard.category)}
            </Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.followUpText}>Follow-up:</Text>
            <Text style={styles.followUpContent}>{currentCard.followUp}</Text>
          </View>

          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            <Text style={styles.flipButtonText}>Tap to flip back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={skipCard}
        >
          <Text style={styles.actionButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.nextButton]}
          onPress={nextCard}
        >
          <Text style={styles.actionButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          Cards remaining: {remainingCards.length + 1}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width - 40,
    height: 400,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backfaceVisibility: "hidden",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  categoryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 32,
  },
  followUpText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  followUpContent: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
  },
  flipButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    marginTop: 20,
  },
  flipButtonText: {
    color: "white",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  skipButton: {
    backgroundColor: "#888",
  },
  nextButton: {
    backgroundColor: "#6a0dad",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  counter: {
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  counterText: {
    color: "#666",
    fontSize: 14,
  },
});
