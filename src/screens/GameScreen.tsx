
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CARDS } from '../lib/data';
import { Card, THEME } from '../lib/types';
import CardComponent from '../components/CardComponent';
import { Ionicons } from '@expo/vector-icons';

const GameScreen = ({ route, navigation }: any) => {
  const { categories } = route.params;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameCards, setGameCards] = useState<Card[]>([]);

  useEffect(() => {
    // Filter cards by enabled categories and shuffle them
    const enabledCategories = categories
      .filter((cat: any) => cat.enabled)
      .map((cat: any) => cat.id);
    
    if (enabledCategories.length === 0) {
      navigation.goBack();
      return;
    }
    
    const filteredCards = CARDS.filter(
      card => enabledCategories.includes(card.category)
    );
    
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    setCurrentCardIndex(0);
  }, [categories, navigation]);

  const handleNextCard = () => {
    if (currentCardIndex < gameCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Reshuffle when we reach the end
      const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
      setGameCards(shuffled);
      setCurrentCardIndex(0);
    }
  };

  const handleReshuffle = () => {
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    setCurrentCardIndex(0);
  };

  if (gameCards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Please select at least one category to play.</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Categories</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = gameCards[currentCardIndex];
  const categoryInfo = categories.find((cat: any) => cat.id === currentCard.category);
  
  // Get category color for the card
  let categoryColor;
  switch(currentCard.category) {
    case 'real-talk':
      categoryColor = THEME.colors.realTalk;
      break;
    case 'relationships':
      categoryColor = THEME.colors.relationships;
      break;
    case 'sex':
      categoryColor = THEME.colors.sex;
      break;
    case 'dating':
      categoryColor = THEME.colors.dating;
      break;
    default:
      categoryColor = THEME.colors.primary;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>Categories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleReshuffle}
        >
          <Ionicons name="shuffle" size={16} color={THEME.colors.primary} />
          <Text style={styles.headerButtonText}>Shuffle</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContainer}>
        <CardComponent 
          card={currentCard} 
          onNextCard={handleNextCard}
          categoryColor={categoryColor}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Card {currentCardIndex + 1} of {gameCards.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xl,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: 'white',
  },
  headerButtonText: {
    color: THEME.colors.primary,
    marginLeft: THEME.spacing.xs,
    fontSize: THEME.fontSizes.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
  },
  footerText: {
    fontSize: THEME.fontSizes.sm,
    color: THEME.colors.mutedForeground,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  emptyStateText: {
    fontSize: THEME.fontSizes.lg,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
  },
  buttonText: {
    color: 'white',
    fontSize: THEME.fontSizes.md,
  },
});

export default GameScreen;
