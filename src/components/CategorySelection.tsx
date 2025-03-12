
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { CategoryInfo, THEME } from '../lib/types';

interface CategorySelectionProps {
  categories: CategoryInfo[];
  onToggleCategory: (categoryId: string) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  categories,
  onToggleCategory
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose Categories</Text>
      <View style={styles.categoriesList}>
        {categories.map((category) => {
          // Get the correct color based on category id
          let dotColor;
          switch(category.id) {
            case 'real-talk':
              dotColor = THEME.colors.realTalk;
              break;
            case 'relationships':
              dotColor = THEME.colors.relationships;
              break;
            case 'sex':
              dotColor = THEME.colors.sex;
              break;
            case 'dating':
              dotColor = THEME.colors.dating;
              break;
            default:
              dotColor = THEME.colors.primary;
          }
          
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => onToggleCategory(category.id)}
              activeOpacity={0.8}
            >
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: dotColor }]} />
                <View style={styles.categoryText}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>
              <Switch
                value={category.enabled}
                onValueChange={() => onToggleCategory(category.id)}
                trackColor={{ false: '#e0e0e0', true: dotColor }}
                thumbColor={category.enabled ? '#ffffff' : '#f4f3f4'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: THEME.spacing.lg,
  },
  heading: {
    fontSize: THEME.fontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  categoriesList: {
    gap: THEME.spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: THEME.spacing.md,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: THEME.borderRadius.full,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontWeight: '500',
    fontSize: THEME.fontSizes.md,
  },
  categoryDescription: {
    fontSize: THEME.fontSizes.sm,
    color: THEME.colors.mutedForeground,
  },
});

export default CategorySelection;
