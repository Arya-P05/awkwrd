
import React, { useState, useEffect } from 'react';
import CardComponent from './CardComponent';
import { Card, Category, CategoryInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

interface GameProps {
  cards: Card[];
  categories: CategoryInfo[];
  onBackToCategories: () => void;
}

const Game: React.FC<GameProps> = ({ 
  cards, 
  categories,
  onBackToCategories 
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameCards, setGameCards] = useState<Card[]>([]);

  useEffect(() => {
    // Filter cards by enabled categories and shuffle them
    const enabledCategories = categories
      .filter(cat => cat.enabled)
      .map(cat => cat.id);
    
    if (enabledCategories.length === 0) {
      onBackToCategories();
      return;
    }
    
    const filteredCards = cards.filter(
      card => enabledCategories.includes(card.category)
    );
    
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    setCurrentCardIndex(0);
  }, [cards, categories, onBackToCategories]);

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
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg mb-4">Please select at least one category to play.</p>
        <Button onClick={onBackToCategories}>Back to Categories</Button>
      </div>
    );
  }

  const currentCard = gameCards[currentCardIndex];
  const categoryInfo = categories.find(cat => cat.id === currentCard.category);
  const categoryColor = categoryInfo ? categoryInfo.color : '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onBackToCategories}>
          Categories
        </Button>
        <Button variant="outline" onClick={handleReshuffle}>
          <Shuffle size={16} className="mr-2" /> Shuffle
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <CardComponent 
          card={currentCard} 
          onNextCard={handleNextCard}
          categoryColor={categoryColor}
        />
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Card {currentCardIndex + 1} of {gameCards.length}
      </div>
    </div>
  );
};

export default Game;
