
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card, THEME } from '../lib/types';

interface CardComponentProps {
  card: Card;
  onNextCard: () => void;
  categoryColor: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  card, 
  onNextCard,
  categoryColor 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    if (isFlipped) return;
    
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(true);
    });
  };

  const handleNext = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
      onNextCard();
    });
  };

  // Interpolate rotation values
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Create animated styles
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: flipAnim.interpolate({
      inputRange: [0.5, 1],
      outputRange: [1, 0],
    }),
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5],
      outputRange: [0, 1],
    }),
  };

  // Format category name
  const formattedCategory = card.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <View style={styles.container}>
      {/* Front of card */}
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.cardInner} 
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          <View style={[styles.categoryPill, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{formattedCategory}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.tapText}>Tap to reveal question</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Back of card */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.cardInner}>
          <View style={[styles.categoryPill, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{formattedCategory}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.questionText}>{card.question}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: categoryColor }]} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 450,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: THEME.borderRadius.xl,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backfaceVisibility: 'hidden',
  },
  cardInner: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.full,
    marginBottom: THEME.spacing.md,
  },
  categoryText: {
    color: 'white',
    fontWeight: '500',
    fontSize: THEME.fontSizes.sm,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapText: {
    fontSize: THEME.fontSizes.lg,
    color: THEME.colors.mutedForeground,
    textAlign: 'center',
  },
  questionText: {
    fontSize: THEME.fontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: THEME.fontSizes.xl * 1.5,
  },
  nextButton: {
    alignSelf: 'flex-end',
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.full,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default CardComponent;
