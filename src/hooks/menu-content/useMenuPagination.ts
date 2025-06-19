
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

    const serviceLineHeight = measurements?.serviceLineHeight || 15;
    return A4_HEIGHT_MM - topMargin - bottomMargin - serviceLineHeight - 5; // 5mm buffer
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
        currentPageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }
    };

    categories.forEach(category => {
      const categoryTitleHeight = measurements.categoryHeights.get(category.id) || 40;
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      const categoryNotesHeight = relatedNotes.reduce((sum, note) => 
        sum + (measurements.categoryNoteHeights.get(note.id) || 20), 0
      );

      const products = productsByCategory[category.id] || [];
      let remainingProducts = [...products]; // Copia di tutti i prodotti da processare
      let categoryHeaderAddedOnCurrentPage = false;

      // Continua finché ci sono prodotti rimanenti da processare
      while (remainingProducts.length > 0) {
        let currentCategoryProducts: Product[] = [];
        let tempHeight = currentPageHeight;

        // Se non abbiamo ancora aggiunto l'header della categoria in questa pagina
        if (!categoryHeaderAddedOnCurrentPage) {
          let categoryHeaderHeight = categoryTitleHeight + categoryNotesHeight;
          
          // Aggiungi spacing tra categorie se c'è già contenuto nella pagina
          if (currentPageContent.length > 0) {
            categoryHeaderHeight += layout?.spacing.betweenCategories || 0;
          }

          // Controlla se l'header della categoria può entrare in questa pagina
          const availableHeight = getAvailableHeight(currentPageNumber);
          if (tempHeight + categoryHeaderHeight > availableHeight && currentPageContent.length > 0) {
            // L'header non entra, inizia una nuova pagina
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
          const productHeight = measurements.productHeights.get(product.id) || 50;
          let requiredHeight = productHeight;

          // Aggiungi spacing tra prodotti (tranne per il primo prodotto nella categoria su questa pagina)
          if (currentCategoryProducts.length > 0) {
            requiredHeight += layout?.spacing.betweenProducts || 0;
          }

          const availableHeight = getAvailableHeight(currentPageNumber);
          
          // Controlla se questo prodotto può entrare nella pagina corrente
          if (tempHeight + requiredHeight <= availableHeight) {
            // Il prodotto entra nella pagina
            currentCategoryProducts.push(product);
            tempHeight += requiredHeight;
          } else {
            // Il prodotto non entra, fermiamo qui e il resto andrà nella pagina successiva
            break;
          }
        }

        // Se non siamo riusciti ad aggiungere nemmeno un prodotto, forza l'aggiunta del primo
        // per evitare loop infiniti (può succedere con prodotti molto alti)
        if (currentCategoryProducts.length === 0 && remainingProducts.length > 0) {
          currentCategoryProducts.push(remainingProducts[0]);
          console.warn(`Prodotto "${remainingProducts[0].title}" troppo alto per la pagina, forzato comunque`);
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
        }

        // Se ci sono ancora prodotti rimanenti, dovranno andare in una nuova pagina
        if (remainingProducts.length > 0) {
          addNewPage();
          categoryHeaderAddedOnCurrentPage = false; // Reset per la nuova pagina
        }
      }
    });

    // Aggiungi l'ultima pagina se contiene contenuto
    addNewPage();

    console.log(`Paginazione completata: ${pages.length} pagine generate`);
    pages.forEach((page, index) => {
      const totalProducts = page.categories.reduce((sum, cat) => sum + cat.products.length, 0);
      console.log(`Pagina ${page.pageNumber}: ${page.categories.length} categorie, ${totalProducts} prodotti`);
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
