
// hooks/menu-content/useMenuPagination.ts
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { usePreRenderMeasurement } from '../print/usePreRenderMeasurement';

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
  layout: PrintLayout | null
) => {
  const A4_HEIGHT_MM = 297;
  const SAFETY_MARGIN_MM = 8; // Ridotto da 15 a 8mm per maggiore precisione

  // Usa il sistema di pre-render per ottenere le misurazioni reali
  const { measurements, isLoading } = usePreRenderMeasurement(
    layout,
    categories,
    productsByCategory,
    categoryNotes,
    categoryNotesRelations,
    serviceCoverCharge
  );

  const getAvailableHeight = (pageNumber: number): number => {
    if (!layout) return 250; // Default available height

    const margins = layout.page;
    let topMargin = margins.marginTop;
    let bottomMargin = margins.marginBottom;

    // Check if using distinct margins for odd/even pages
    if (margins.useDistinctMarginsForPages && pageNumber > 1) {
      if (pageNumber % 2 === 1) { // Odd page
        topMargin = margins.oddPages.marginTop;
        bottomMargin = margins.oddPages.marginBottom;
      } else { // Even page
        topMargin = margins.evenPages.marginTop;
        bottomMargin = margins.evenPages.marginBottom;
      }
    }

    // IMPORTANTE: La serviceLineHeight già include i margini del servizio
    const serviceLineHeight = measurements?.serviceLineHeight || 20; // Ridotto da 25 a 20mm
    
    // Calcola altezza disponibile
    const totalHeight = A4_HEIGHT_MM - topMargin - bottomMargin - serviceLineHeight - SAFETY_MARGIN_MM;
    
    console.log('📐 Pagina ' + pageNumber + ' - Calcolo altezza disponibile:', {
      A4_HEIGHT_MM,
      topMargin,
      bottomMargin,
      serviceLineHeight,
      SAFETY_MARGIN_MM,
      totalHeight,
      calculation: A4_HEIGHT_MM + ' - ' + topMargin + ' - ' + bottomMargin + ' - ' + serviceLineHeight + ' - ' + SAFETY_MARGIN_MM + ' = ' + totalHeight
    });
    
    return totalHeight;
  };

  const createPages = (): PageContent[] => {
    // Se le misurazioni non sono pronte, restituisci array vuoto
    if (!measurements || isLoading) {
      return [];
    }

    const pages: PageContent[] = [];
    let currentPageNumber = 3; // Starting after cover pages
    let currentPageHeight = 0;
    let currentPageContent: PageContent['categories'] = [];

    const addNewPage = () => {
      if (currentPageContent.length > 0) {
        pages.push({
          pageNumber: currentPageNumber,
          categories: [...currentPageContent],
          serviceCharge: serviceCoverCharge
        });
        console.log('📄 Creata pagina ' + currentPageNumber + ' con ' + currentPageContent.length + ' categorie, altezza totale: ' + currentPageHeight.toFixed(2) + 'mm');
        currentPageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }
    };

    categories.forEach((category, categoryIndex) => {
      const categoryTitleHeight = measurements.categoryHeights.get(category.id) || 40; // Ridotto da 50 a 40mm
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      
      // L'altezza categoria include già le note nel nuovo sistema
      const totalCategoryHeaderHeight = categoryTitleHeight;

      const products = productsByCategory[category.id] || [];
      let remainingProducts = [...products];
      let categoryHeaderAddedOnCurrentPage = false;

      console.log('📊 Categoria "' + category.title + '": ' + products.length + ' prodotti, altezza header: ' + totalCategoryHeaderHeight.toFixed(2) + 'mm');

      // Continua finché ci sono prodotti rimanenti da processare
      while (remainingProducts.length > 0) {
        let currentCategoryProducts: Product[] = [];
        let tempHeight = currentPageHeight;

        // Se non abbiamo ancora aggiunto l'header della categoria in questa pagina
        if (!categoryHeaderAddedOnCurrentPage) {
          let categoryHeaderHeight = totalCategoryHeaderHeight;
          
          // Aggiungi spacing tra categorie se c'è già contenuto nella pagina
          if (currentPageContent.length > 0) {
            categoryHeaderHeight += layout?.spacing.betweenCategories || 12; // Ridotto da 15 a 12mm
          }

          // Controlla se l'header della categoria può entrare in questa pagina
          const availableHeight = getAvailableHeight(currentPageNumber);
          if (tempHeight + categoryHeaderHeight > availableHeight && currentPageContent.length > 0) {
            console.log('⚠️ Header categoria non entra (' + tempHeight.toFixed(2) + ' + ' + categoryHeaderHeight.toFixed(2) + ' > ' + availableHeight.toFixed(2) + '), nuova pagina');
            addNewPage();
            tempHeight = 0;
          }

          // Aggiungi l'altezza dell'header
          tempHeight += categoryHeaderHeight;
          categoryHeaderAddedOnCurrentPage = true;
        }

        // Prova ad aggiungere quanti più prodotti possibile in questa pagina
        for (let i = 0; i < remainingProducts.length; i++) {
          const product = remainingProducts[i];
          const productHeight = measurements.productHeights.get(product.id) || 45; // Ridotto da 60 a 45mm
          let requiredHeight = productHeight;

          // Aggiungi spacing tra prodotti (tranne per il primo prodotto nella categoria su questa pagina)
          if (currentCategoryProducts.length > 0) {
            requiredHeight += layout?.spacing.betweenProducts || 4; // Ridotto da 5 a 4mm
          }

          const availableHeight = getAvailableHeight(currentPageNumber);
          
          // Controlla con un margine di sicurezza ridotto (5% invece del 10%)
          const safeRequiredHeight = requiredHeight * 1.05;
          
          // Log dettagliato per prodotti critici o quando si avvicina al limite
          const shouldLog = i < 2 || tempHeight + safeRequiredHeight > availableHeight * 0.9;
          if (shouldLog) {
            const productTitle = product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title;
            console.log('📦 Prodotto ' + (i+1) + '/' + remainingProducts.length + ' "' + productTitle + '":', {
              productHeight: productHeight.toFixed(2),
              spacing: currentCategoryProducts.length > 0 ? (layout?.spacing.betweenProducts || 4) : 0,
              requiredHeight: requiredHeight.toFixed(2),
              safeRequiredHeight: safeRequiredHeight.toFixed(2),
              currentPageHeight: tempHeight.toFixed(2),
              wouldBe: (tempHeight + safeRequiredHeight).toFixed(2),
              availableHeight: availableHeight.toFixed(2),
              fits: tempHeight + safeRequiredHeight <= availableHeight,
              utilizzo: ((tempHeight + safeRequiredHeight) / availableHeight * 100).toFixed(1) + '%'
            });
          }
          
          if (tempHeight + safeRequiredHeight <= availableHeight) {
            // Il prodotto entra nella pagina
            currentCategoryProducts.push(product);
            tempHeight += requiredHeight;
          } else {
            console.log('⚠️ Prodotto "' + product.title + '" non entra (' + tempHeight.toFixed(2) + ' + ' + safeRequiredHeight.toFixed(2) + ' > ' + availableHeight.toFixed(2) + ')');
            break;
          }
        }

        // Se non siamo riusciti ad aggiungere nemmeno un prodotto, forza l'aggiunta del primo
        if (currentCategoryProducts.length === 0 && remainingProducts.length > 0) {
          currentCategoryProducts.push(remainingProducts[0]);
          const forcedProductHeight = measurements.productHeights.get(remainingProducts[0].id) || 45;
          tempHeight += forcedProductHeight;
          console.warn('⚠️ Prodotto "' + remainingProducts[0].title + '" troppo alto per la pagina, forzato comunque (altezza: ' + forcedProductHeight.toFixed(2) + 'mm)');
        }

        // Aggiungi la sezione categoria alla pagina corrente
        if (currentCategoryProducts.length > 0) {
          const isRepeatedTitle = currentPageContent.some(c => c.category.id === category.id);
          
          currentPageContent.push({
            category,
            notes: !isRepeatedTitle ? relatedNotes : [], // Note solo la prima volta
            products: [...currentCategoryProducts],
            isRepeatedTitle
          });

          // Aggiorna l'altezza della pagina corrente
          currentPageHeight = tempHeight;

          // Rimuovi i prodotti processati dalla lista dei rimanenti
          remainingProducts = remainingProducts.slice(currentCategoryProducts.length);
          
          console.log('✅ Aggiunti ' + currentCategoryProducts.length + ' prodotti, rimanenti: ' + remainingProducts.length + ', altezza pagina: ' + currentPageHeight.toFixed(2) + 'mm');
        }

        // Se ci sono ancora prodotti rimanenti, dovranno andare in una nuova pagina
        if (remainingProducts.length > 0) {
          console.log('📄 Prodotti rimanenti richiedono nuova pagina');
          addNewPage();
          categoryHeaderAddedOnCurrentPage = false; // Reset per la nuova pagina
        }
      }
    });

    // Aggiungi l'ultima pagina se contiene contenuto
    addNewPage();

    console.log('✅ Paginazione completata: ' + pages.length + ' pagine generate');
    pages.forEach((page, index) => {
      const totalProducts = page.categories.reduce((sum, cat) => sum + cat.products.length, 0);
      const totalCategories = page.categories.length;
      const uniqueCategories = new Set(page.categories.map(c => c.category.id)).size;
      console.log('📄 Pagina ' + page.pageNumber + ': ' + totalCategories + ' sezioni (' + uniqueCategories + ' categorie uniche), ' + totalProducts + ' prodotti totali');
    });

    return pages;
  };

  return {
    createPages,
    getAvailableHeight,
    isLoadingMeasurements: isLoading,
    measurements
  };
};
