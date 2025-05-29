
import React from 'react';
import { Category } from '@/types/database';
import { Button } from '@/components/ui/button';

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
  // Sidebar desktop sticky
  if (deviceView === 'desktop') {
    return (
      <div className="col-span-1">
        <div className="sticky top-24 z-30 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Categorie</h3>
          <div className="space-y-1 pr-4">
            {categories.map(category => {
              const displayTitle = category.displayTitle || category.title;
              
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSelectCategory(category.id)}
                >
                  {displayTitle}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MOBILE: barra orizzontale con design migliorato
  return (
    <div className="w-full sticky top-[88px] z-40 bg-white border-b border-gray-200 shadow-md">
      <div className="relative overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar space-x-3 px-4 py-3">
          {categories.map(category => {
            const displayTitle = category.displayTitle || category.title;
            
            return (
              <button
                key={category.id}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 
                  ${selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}`}
                onClick={() => onSelectCategory(category.id)}
              >
                {displayTitle}
              </button>
            );
          })}
        </div>
        
        {/* Gradiente per indicare che c'è altro contenuto scrollabile */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
      
      {/* Inline style per no-scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
