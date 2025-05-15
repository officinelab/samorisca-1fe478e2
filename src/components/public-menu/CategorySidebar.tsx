
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
  // DEBUG: Mostra che props arrivano
  console.log('--- [CategorySidebar] ---');
  console.log('language:', language);
  console.log('categories sample:', categories && categories.length > 0 ? categories[0] : null);

  // Sidebar desktop sticky (invariato)
  if (deviceView === 'desktop') {
    return (
      <div className="col-span-1">
        <div className="sticky top-24 z-30 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Categorie</h3>
          <div className="space-y-1 pr-4">
            {categories.map(category => {
              const key =
                language !== 'it' &&
                typeof language === "string" &&
                category[`title_${language}`]
                  ? `title_${language}`
                  : 'title';

              // Mostra anche nel debug il campo usato
              console.log(
                `[CategorySidebar] category.id: ${category.id} | language: ${language} | title: ${category[key]}`
              );

              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSelectCategory(category.id)}
                >
                  {category[key] || category.title}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MOBILE: barra orizzontale scrollabile, con top maggiore per non sovrapporsi all'header
  return (
    <div className="w-full overflow-hidden mb-6 sticky top-20 z-30 bg-gray-50 pt-4">
      <div className="flex overflow-x-auto no-scrollbar space-x-4 px-4 py-2">
        {categories.map((category) => {
          const key =
            language !== 'it' &&
            typeof language === "string" &&
            category[`title_${language}`]
              ? `title_${language}`
              : 'title';

          // Debug anche qui
          console.log(
            `[CategorySidebar MOBILE] category.id: ${category.id} | language: ${language} | title: ${category[key]}`
          );

          return (
            <button
              key={category.id}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium shadow transition-colors
                ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              onClick={() => onSelectCategory(category.id)}
            >
              {category[key] || category.title}
            </button>
          );
        })}
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
