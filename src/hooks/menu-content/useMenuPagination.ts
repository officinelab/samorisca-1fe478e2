import { useState, useCallback, useMemo } from 'react';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';
import { useHeightCalculator } from './useHeightCalculator';

interface PageContent {
  pageNumber: number;
  categories: {
    category: Category;
    notes: CategoryNote[];
    products: Product[];
    isRepeatedTitle: boolean;
  }[];
  serviceCharge: number;
}

export const useMenuPagination = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number,
  layout?: PrintLayout
) => {
  const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false);
  
  const { 
    calculateCategoryHeight,
    calculateProductHeight,
    calculateServiceLineHeight,
    isLoading: isCalculating
  } = useHeightCalculator(layout);

  const createPages = useCallback((): PageContent[] => {
    if (!layout || categories.length === 0) {
      return [];
    }

    console.log('🔄 Creating pages with page breaks consideration...');
    
    const pages: PageContent[] = [];
    let currentPage: PageContent = {
      pageNumber: 1,
      categories: [],
      serviceCharge: serviceCoverCharge
    };

    const PAGE_HEIGHT = 297; // A4 height in mm
    const margins = {
      marginTop: layout.page.marginTop,
      marginBottom: layout.page.marginBottom
    };
    const availableHeight = PAGE_HEIGHT - margins.marginTop - margins.marginBottom - 20; // Reserve space for service charge

    let currentHeight = 0;

    // Ordina le categorie per display_order
    const sortedCategories = [...categories]
      .filter(cat => cat.is_active)
      .sort((a, b) => a.display_order - b.display_order);

    console.log('📋 Processing categories with page breaks:', {
      totalCategories: sortedCategories.length,
      pageBreakCategoryIds: layout.pageBreaks?.categoryIds || []
    });

    for (let i = 0; i < sortedCategories.length; i++) {
      const category = sortedCategories[i];
      const categoryProducts = (productsByCategory[category.id] || [])
        .filter(product => product.is_active)
        .sort((a, b) => a.display_order - b.display_order);

      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));

      // Calcola altezza della categoria
      const categoryHeight = calculateCategoryHeight(category, relatedNotes, layout);
      
      // Calcola altezza totale dei prodotti
      let totalProductsHeight = 0;
      for (const product of categoryProducts) {
        totalProductsHeight += calculateProductHeight(product, layout);
      }

      const totalCategoryHeight = categoryHeight + totalProductsHeight;

      // Verifica se la categoria supera l'altezza disponibile o se è richiesta interruzione di pagina
      const hasPageBreakBefore = layout.pageBreaks?.categoryIds?.includes(category.id) && currentPage.categories.length > 0;
      const needsNewPageForHeight = currentHeight + totalCategoryHeight > availableHeight && currentPage.categories.length > 0;

      if (hasPageBreakBefore || needsNewPageForHeight) {
        // Completa la pagina corrente
        if (currentPage.categories.length > 0) {
          pages.push(currentPage);
          console.log(`📄 Created page ${currentPage.pageNumber} with ${currentPage.categories.length} categories`);
          if (hasPageBreakBefore) {
            console.log(`🔗 Page break forced after category: ${currentPage.categories[currentPage.categories.length - 1].category.title}`);
          }
        }

        // Inizia una nuova pagina
        currentPage = {
          pageNumber: pages.length + 1,
          categories: [],
          serviceCharge: serviceCoverCharge
        };
        currentHeight = 0;
      }

      // Aggiungi la categoria alla pagina corrente
      currentPage.categories.push({
        category,
        notes: relatedNotes,
        products: categoryProducts,
        isRepeatedTitle: false
      });

      currentHeight += totalCategoryHeight;

      console.log(`✅ Added category "${category.title}" to page ${currentPage.pageNumber}, height: ${totalCategoryHeight.toFixed(1)}mm`);

      // Verifica se questa categoria richiede un'interruzione di pagina
      const hasPageBreakAfter = layout.pageBreaks?.categoryIds?.includes(category.id);
      const isLastCategory = i === sortedCategories.length - 1;
      
      if (hasPageBreakAfter && !isLastCategory) {
        // Forza una nuova pagina dopo questa categoria
        pages.push(currentPage);
        console.log(`📄 Created page ${currentPage.pageNumber} with page break after category: ${category.title}`);
        
        currentPage = {
          pageNumber: pages.length + 1,
          categories: [],
          serviceCharge: serviceCoverCharge
        };
        currentHeight = 0;
      }
    }

    // Aggiungi l'ultima pagina se contiene categorie
    if (currentPage.categories.length > 0) {
      pages.push(currentPage);
      console.log(`📄 Created final page ${currentPage.pageNumber} with ${currentPage.categories.length} categories`);
    }

    console.log(`🎯 Total pages created: ${pages.length}`);
    return pages;

  }, [
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge,
    layout,
    calculateCategoryHeight,
    calculateProductHeight
  ]);

  return {
    createPages,
    isLoadingMeasurements: isCalculating || isLoadingMeasurements
  };
};
