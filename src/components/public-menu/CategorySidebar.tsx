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
  // DEBUG: Visualizza props principali
  console.log('--- [CategorySidebar] ---');
  console.log('language:', language);
  console.log('categories sample:', categories && categories.length > 0 ? categories[0] : null);

  // Sidebar desktop sticky
  if (deviceView === 'desktop') {
    return <div className="col-span-1">
        <div className="sticky top-24 z-30 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Categorie</h3>
          <div className="space-y-1 pr-4">
            {categories.map(category => {
            // Sempre mostra displayTitle (tradotto dal backend) o fallback all'originale
            const displayTitle = category.displayTitle || category.title;
            console.log(`[CategorySidebar] category.id: ${category.id} | language: ${language} | displayTitle: ${displayTitle}`);
            return <Button key={category.id} variant={selectedCategory === category.id ? "default" : "ghost"} className="w-full justify-start" onClick={() => onSelectCategory(category.id)}>
                  {displayTitle}
                </Button>;
          })}
          </div>
        </div>
      </div>;
  }

  // MOBILE: barra orizzontale scrollabile, con top maggiore per non sovrapporsi all'header
  return <div className="w-full overflow-hidden mb-6 sticky top-16 z-20 pt-4 py-px bg-white">
      <div className="flex overflow-x-auto no-scrollbar space-x-4 px-4 py-2">
        {categories.map(category => {
        const displayTitle = category.displayTitle || category.title;
        console.log(`[CategorySidebar MOBILE] category.id: ${category.id} | language: ${language} | displayTitle: ${displayTitle}`);
        return <button key={category.id} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium shadow transition-colors
                ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => onSelectCategory(category.id)}>
              {displayTitle}
            </button>;
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
    </div>;
};