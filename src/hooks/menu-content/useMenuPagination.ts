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
  const SAFETY_MARGIN_MM = 10; // Margine di sicurezza aggiuntivo

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
    const serviceLineHeight = measurements?.serviceLineHeight || 25; // Default più conservativo
    
    // Calcola altezza disponibile
    const totalHeight = A4_HEIGHT_MM - topMargin - bottomMargin - serviceLineHeight - SAFETY_MARGIN_MM;
    
    console.log(`📐 Pagina ${pageNumber} - Calcolo altezza disponibile:`, {
      A4_HEIGHT_MM,
      topMargin,
      bottomMargin,
      serviceLineHeight,
      SAFETY_MARGIN_MM,
      totalHeight,
      calculation: `${A4_HEIGHT_MM} - ${topMargin} - ${bottomMargin} - ${serviceLineHeight} - ${SAFETY_MARGIN_MM} = ${totalHeight}`
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
        console.log(`📄 Creata pagina ${currentPageNumber} con ${currentPageContent.length} categorie, altezza totale: ${currentPageHeight}mm`);
        currentPageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }
    };

    categories.forEach((category, categoryIndex) => {
      const categoryTitleHeight = measurements.categoryHeights.get(category.id) || 50; // Default più alto
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      
      // L'altezza categoria include già le note nel nuovo sistema
      const totalCategoryHeaderHeight = categoryTitleHeight;

      const products = productsByCategory[category.id] || [];
      let remainingProducts = [...products];
      let categoryHeaderAddedOnCurrentPage = false;

      console.log(`📊 Categoria "${category.title}": ${products.length} prodotti, altezza header: ${totalCategoryHeaderHeight}mm`);

      // Continua finché ci sono prodotti rimanenti da processare
      while (remainingProducts.length > 0) {
        let currentCategoryProducts: Product[] = [];
        let tempHeight = currentPageHeight;

        // Se non abbiamo ancora aggiunto l'header della categoria in questa pagina
        if (!categoryHeaderAddedOnCurrentPage) {
          let categoryHeaderHeight = totalCategoryHeaderHeight;
          
          // Aggiungi spacing tra categorie se c'è già contenuto nella pagina
          if (currentPageContent.length > 0) {
            categoryHeaderHeight += layout?.spacing.betweenCategories || 15;
          }

          // Controlla se l'header della categoria può entrare in questa pagina
          const availableHeight = getAvailableHeight(currentPageNumber);
          if (tempHeight + categoryHeaderHeight > availableHeight && currentPageContent.length > 0) {
            console.log(`⚠️ Header categoria non entra (${tempHeight} + ${categoryHeaderHeight} > ${availableHeight}), nuova pagina`);
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
          const productHeight = measurements.productHeights.get(product.id) || 60; // Default più alto
          let requiredHeight = productHeight;

          // Aggiungi spacing tra prodotti (tranne per il primo prodotto nella categoria su questa pagina)
          if (currentCategoryProducts.length > 0) {
            requiredHeight += layout?.spacing.betweenProducts || 5;
          }

          const availableHeight = getAvailableHeight(currentPageNumber);
          
          // Controlla con un margine di sicurezza extra del 5%
          const safeRequiredHeight = requiredHeight * 1.05;
          
          // Log dettagliato per ogni prodotto
          if (i < 3 || tempHeight + safeRequiredHeight > availableHeight) {
            console.log(`📦 Prodotto ${i+1}/${remainingProducts.length} "${product.title.substring(0, 30)}...":`, {
              productHeight,
              spacing: currentCategoryProducts.length > 0 ? layout?.spacing.betweenProducts || 5 : 0,
              requiredHeight,
              safeRequiredHeight,
              currentPageHeight: tempHeight,
              wouldBe: tempHeight + safeRequiredHeight,
              availableHeight,
              fits: tempHeight + safeRequiredHeight <= availableHeight
            });
          }
          
          if (tempHeight + safeRequiredHeight <= availableHeight) {
            // Il prodotto entra nella pagina
            currentCategoryProducts.push(product);
            tempHeight += requiredHeight;
          } else {
            console.log(`⚠️ Prodotto "${product.title}" non entra (${tempHeight} + ${safeRequiredHeight} > ${availableHeight})`);
            break;
          }
        }

        // Se non siamo riusciti ad aggiungere nemmeno un prodotto, forza l'aggiunta del primo
        if (currentCategoryProducts.length === 0 && remainingProducts.length > 0) {
          currentCategoryProducts.push(remainingProducts[0]);
          console.warn(`⚠️ Prodotto "${remainingProducts[0].title}" troppo alto per la pagina, forzato comunque`);
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
          
          console.log(`✅ Aggiunti ${currentCategoryProducts.length} prodotti, rimanenti: ${remainingProducts.length}`);
        }

        // Se ci sono ancora prodotti rimanenti, dovranno andare in una nuova pagina
        if (remainingProducts.length > 0) {
          console.log(`📄 Prodotti rimanenti richiedono nuova pagina`);
          addNewPage();
          categoryHeaderAddedOnCurrentPage = false; // Reset per la nuova pagina
        }
      }
    });

    // Aggiungi l'ultima pagina se contiene contenuto
    addNewPage();

    console.log(`✅ Paginazione completata: ${pages.length} pagine generate`);
    pages.forEach((page, index) => {
      const totalProducts = page.categories.reduce((sum, cat) => sum + cat.products.length, 0);
      console.log(`📄 Pagina ${page.pageNumber}: ${page.categories.length} sezioni categoria, ${totalProducts} prodotti totali`);
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