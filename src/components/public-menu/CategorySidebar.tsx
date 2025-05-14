import React from 'react';
import { Category } from '@/types/database';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  deviceView: 'mobile' | 'desktop';
  onSelectCategory: (categoryId: string) => void;
  language?: string;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  deviceView,
  onSelectCategory,
  language = 'it'
}) => {
  // Sidebar desktop sticky SENZA overflow interno o ScrollArea
  if (deviceView === 'desktop') {
    return (
      <div className="col-span-1">
        <div className="sticky top-24 z-30 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Categorie</h3>
          <div className="space-y-1 pr-4">
            {categories.map(category => {
              const categoryTitle = language !== 'it' && category[`title_${language}`]
                ? category[`title_${language}`]
                : category.title;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSelectCategory(category.id)}
                >
                  {categoryTitle}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Categoria orizzontale mobile sticky, SENZA overflow-x-auto
  return (
    <div className="mb-6 hide-scrollbar sticky top-14 z-30 bg-gray-50">
      <div className="flex space-x-2 pb-2">
        {categories.map(category => {
          const categoryTitle = language !== 'it' && category[`title_${language}`]
            ? category[`title_${language}`]
            : category.title;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onSelectCategory(category.id)}
              className="whitespace-nowrap"
            >
              {categoryTitle}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
