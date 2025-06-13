
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import CoverPage from '../shared/CoverPage';
import AllergensPage from '../shared/AllergensPage';
import PaginatedContent from '../pagination/PaginatedContent';

type ClassicLayoutProps = {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
};

const ClassicLayout: React.FC<ClassicLayoutProps> = ({
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout
}) => {
  // Debug log per verificare che il customLayout venga passato correttamente
  useEffect(() => {
    console.log("ClassicLayout - customLayout:", customLayout);
  }, [customLayout]);

  // --- Calcolo il numero di pagine del menu dinamicamente ---
  // Copertina (1), Vuota (2), poi pagine menu (>=3), infine allergeni (ultimo).
  // Otteniamo il numero di pagine menu simulando la paginazione
  // Per evitare import ciclici, lo ricaviamo a runtime da PaginatedContent che già fa le divisioni

  // Lo facciamo gestire direttamente nei componenti figli tramite "startPageIndex" e badge

  return (
    <>
      {/* Pagina di copertina (pagina 1) */}
      <CoverPage 
        A4_WIDTH_MM={A4_WIDTH_MM} 
        A4_HEIGHT_MM={A4_HEIGHT_MM} 
        showPageBoundaries={showPageBoundaries}
        layoutType={customLayout?.type || "classic"}
        restaurantLogo={restaurantLogo}
        customLayout={customLayout}
        pageIndex={1} // Numero umano (pagina 1)
      />

      {/* Pagina vuota (pagina 2, retro copertina) */}
      <div 
        className="page blank-page bg-white"
        style={{
          width: `${A4_WIDTH_MM}mm`,
          height: `${A4_HEIGHT_MM}mm`,
          padding: '0',
          boxSizing: 'border-box',
          margin: '0 auto 60px auto',
          pageBreakAfter: 'always',
          breakAfter: 'page',
          border: showPageBoundaries ? '2px dashed #e2e8f0' : 'none',
          boxShadow: showPageBoundaries ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
          position: 'relative'
        }}
      >
        {/* Badge numero pagina SOLO in anteprima */}
        {showPageBoundaries && (
          <div 
            className="absolute top-3 left-3 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded shadow border border-blue-300"
            style={{zIndex: 100}}
          >
            Pagina 2 (Vuota / retro copertina)
          </div>
        )}
      </div>

      {/* Contenuto paginato: parte dalla pagina 3 */}
      <PaginatedContent
        A4_WIDTH_MM={A4_WIDTH_MM}
        A4_HEIGHT_MM={A4_HEIGHT_MM}
        showPageBoundaries={showPageBoundaries}
        categories={categories}
        products={products}
        selectedCategories={selectedCategories}
        language={language}
        customLayout={customLayout}
        startPageIndex={3} // Le pagine del menù partono dalla 3
      />

      {/* Pagina degli allergeni: dopo tutte le pagine menu */}
      {printAllergens && allergens.length > 0 && (
        <div style={{position: "relative"}}>
          <AllergensPage
            A4_WIDTH_MM={A4_WIDTH_MM}
            A4_HEIGHT_MM={A4_HEIGHT_MM}
            showPageBoundaries={showPageBoundaries}
            allergens={allergens}
            layoutType={customLayout?.type || "classic"}
            restaurantLogo={restaurantLogo}
            customLayout={customLayout}
          />
          {/* Etichetta Pagina Allergeni */}
          {showPageBoundaries && (
            <div 
              className="absolute top-3 left-3 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded shadow border border-blue-300"
              style={{zIndex: 100}}
            >
              {/* Il numero è: 3 + numero pagine menu */}
              {/* Ne ricaviamo il valore in PaginatedContent.tsx (vedi sotto) */}
              Pagina <span id="allergens-page-number-label" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ClassicLayout;
