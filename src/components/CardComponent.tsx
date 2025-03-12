
import React, { useState } from 'react';
import { Card as CardType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

interface CardComponentProps {
  card: CardType;
  onNextCard: () => void;
  categoryColor: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  card, 
  onNextCard,
  categoryColor
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`card-container w-full h-[450px] mx-auto ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="card-inner relative w-full h-full">
        {/* Front of card */}
        <div className="card-front absolute w-full h-full rounded-2xl bg-white shadow-xl p-6 flex flex-col justify-between">
          <div className="flex justify-center items-center h-full">
            <p className="text-xl font-medium text-center text-gray-500">
              Tap to reveal question
            </p>
          </div>
          <div className={`absolute top-4 left-4 ${categoryColor} category-pill`}>
            {card.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
        </div>

        {/* Back of card */}
        <div className="card-back absolute w-full h-full rounded-2xl bg-white shadow-xl p-6 flex flex-col justify-between">
          <div className="flex justify-center items-center h-full">
            <p className="text-2xl font-bold text-center leading-relaxed">
              {card.question}
            </p>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                setTimeout(onNextCard, 300);
              }}
              className="rounded-full"
            >
              Next <ArrowRightIcon size={16} className="ml-2" />
            </Button>
          </div>
          <div className={`absolute top-4 left-4 ${categoryColor} category-pill`}>
            {card.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
