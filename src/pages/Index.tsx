
import React, { useState } from 'react';
import { CARDS, CATEGORIES } from '@/lib/data';
import CategorySelection from '@/components/CategorySelection';
import Game from '@/components/Game';
import { CategoryInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
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
      alert('Please select at least one category to play.');
      return;
    }
    setGameStarted(true);
  };

  const handleBackToCategories = () => {
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto py-8 px-4 h-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            awkwrd
          </h1>
          <p className="text-muted-foreground mt-2">
            The card game that gets the conversation flowing
          </p>
        </header>

        <main className="flex-1">
          {!gameStarted ? (
            <div className="space-y-8">
              <CategorySelection 
                categories={categories} 
                onToggleCategory={handleToggleCategory} 
              />
              
              <div className="flex justify-center mt-8">
                <Button 
                  size="lg" 
                  onClick={handleStartGame}
                  className="w-full"
                >
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <Game 
              cards={CARDS} 
              categories={categories}
              onBackToCategories={handleBackToCategories} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
