
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types/database";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  deviceView: 'mobile' | 'desktop';
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  deviceView,
  onSelectCategory
}) => {
  return (
    <div className={`${deviceView === 'desktop' ? '' : 'mb-4'}`}>
      <div className="sticky top-20">
        {deviceView === 'mobile' ? (
          <ScrollArea className="w-full">
            <div className="flex space-x-2 pb-2 px-1">
              {categories.map(category => (
                <Button 
                  key={category.id} 
                  variant={selectedCategory === category.id ? "default" : "outline"} 
                  className="whitespace-nowrap" 
                  onClick={() => onSelectCategory(category.id)}
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-3">Categorie</h2>
            <div className="space-y-1">
              {categories.map(category => (
                <Button 
                  key={category.id} 
                  variant={selectedCategory === category.id ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => onSelectCategory(category.id)}
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
