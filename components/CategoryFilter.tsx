import React from 'react';
import { Button } from './ui/Button';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center justify-center">
      <Button 
        variant={activeCategory === 'All' ? 'primary' : 'secondary'}
        onClick={() => onSelectCategory('All')}
        size="sm"
      >
        All
      </Button>
      
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={activeCategory === cat ? 'primary' : 'secondary'}
          onClick={() => onSelectCategory(cat)}
          size="sm"
          className={activeCategory === cat ? "ring-2 ring-black" : ""}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
};