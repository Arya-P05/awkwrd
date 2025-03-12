
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES } from '../lib/data';
import { CategoryInfo, THEME } from '../lib/types';
import CategorySelection from '../components/CategorySelection';

const HomeScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);

  const handleToggleCategory = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, enabled: !category.enabled } 
        : category
    ));
  };

  const handleStartGame = () => {
    const enabledCategories = categories.filter(cat => cat.enabled);
    if (enabledCategories.length === 0) {
      // In a real app, you'd use a proper toast/alert here
      console.warn('Please select at least one category to play.');
      return;
    }
    navigation.navigate('Game', { categories });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>awkwrd</Text>
          <Text style={styles.subtitle}>
            The card game that gets the conversation flowing
          </Text>
        </View>

        <View style={styles.content}>
          <CategorySelection 
            categories={categories}
            onToggleCategory={handleToggleCategory}
          />
          
          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    marginTop: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.fontSizes.xxxl,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.fontSizes.md,
    color: THEME.colors.mutedForeground,
  },
  content: {
    flex: 1,
    marginBottom: THEME.spacing.xl,
  },
  startButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
  },
  startButtonText: {
    color: THEME.colors.primaryForeground,
    fontSize: THEME.fontSizes.lg,
    fontWeight: '600',
  },
});

export default HomeScreen;
