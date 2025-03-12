
import React from 'react';
import { CategoryInfo } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CategorySelectionProps {
  categories: CategoryInfo[];
  onToggleCategory: (categoryId: string) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  categories,
  onToggleCategory
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Categories</h2>
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <div>
                <Label htmlFor={`category-${category.id}`} className="font-medium">
                  {category.name}
                </Label>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <Switch
              id={`category-${category.id}`}
              checked={category.enabled}
              onCheckedChange={() => onToggleCategory(category.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
