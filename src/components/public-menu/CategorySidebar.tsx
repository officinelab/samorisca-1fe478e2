
import React, { useRef, useEffect } from 'react';
import { Category } from '@/types/database';
import { Button } from '@/components/ui/button';
import { useHeaderHeight } from '@/hooks/public-menu/useHeaderHeight';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  deviceView: 'mobile' | 'desktop';
  onSelectCategory: (categoryId: string) => void;
  language?: string;
  isPreview?: boolean;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  deviceView,
  onSelectCategory,
  language = 'it',
  isPreview = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{
    [key: string]: HTMLButtonElement | null;
  }>({});
  
  const { headerHeight } = useHeaderHeight();

  // Auto-scroll quando cambia la categoria selezionata (solo per mobile)
  useEffect(() => {
    if (deviceView === 'mobile' && selectedCategory && categoryRefs.current[selectedCategory] && scrollContainerRef.current) {
      const button = categoryRefs.current[selectedCategory];
      const container = scrollContainerRef.current;
      if (button) {
        // Calcola la posizione per centrare il bottone nel container
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollLeft = button.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedCategory, deviceView]);

  // DESKTOP: mantieni lo stile originale
  if (deviceView === 'desktop') {
    return (
      <div className="col-span-1">
        <div className={`${isPreview ? 'relative' : 'sticky top-24'} z-30 bg-gray-50`}>
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

  // MOBILE: barra orizzontale con zero spazio dall'header
  const positioningClasses = isPreview 
    ? "relative z-50 w-full bg-white border-b border-gray-200"
    : "sticky z-50 w-full bg-white border-b border-gray-200";
    
  // Usa l'altezza header calcolata dinamicamente per eliminare completamente lo spazio
  const topStyle = isPreview ? {} : { top: `${headerHeight}px` };

  return (
    <div 
      id="mobile-category-sidebar"
      className={positioningClasses}
      style={topStyle}
      data-sidebar="mobile"
    >
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar space-x-3 px-4 py-4 scroll-smooth"
        >
          {categories.map(category => {
            const displayTitle = category.displayTitle || category.title;
            return (
              <button
                key={category.id}
                ref={el => categoryRefs.current[category.id] = el}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0
                  ${selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => onSelectCategory(category.id)}
              >
                {displayTitle}
              </button>
            );
          })}
        </div>
        
        {/* Gradienti per indicare che c'è altro contenuto scrollabile */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white via-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white to-transparent pointer-events-none"></div>
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
