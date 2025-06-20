// hooks/menu-content/useMenuPagination.ts
import { PrintLayout } from '@/types/printLayout';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { usePreRenderMeasurement } from '../print/usePreRenderMeasurement';
import { calculateAvailableHeight } from '@/components/menu-print/pagination/utils/pageHeightCalculator';

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
  const SAFETY_MARGIN_MM = 8;

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
    if (!layout) return 250;

    // 🔥 CORREZIONE: Usa la funzione di calcolo ottimizzata che considera correttamente pari/dispari
    const pageIndex = pageNumber - 1; // Convert to 0-based index
    const availableHeightPx = calculateAvailableHeight(pageIndex, A4_HEIGHT_MM, layout);
    
    // Converti da pixel a mm per compatibilità con il resto del codice
    const availableHeightMm = availableHeightPx / MM_TO_PX;
    
    // Sottrai il margine di sicurezza
    const finalHeight = availableHeightMm - SAFETY_MARGIN_MM;
    
    console.log('📐 Pagina ' + pageNumber + ' - Altezza disponibile finale (con correzione pari/dispari):', {
      availableHeightPx: availableHeightPx.toFixed(2),
      availableHeightMm: availableHeightMm.toFixed(2),
      SAFETY_MARGIN_MM,
      finalHeight: finalHeight.toFixed(2),
      isOddPage: pageNumber % 2 === 1
    });
    
    return finalHeight;
  };

  const createPages = (): PageContent[] => {
    if (!measurements || isLoading) {
      return [];
    }

    const pages: PageContent[] = [];
    let currentPageNumber = 3; // Starting after cover pages
    let currentPageHeight = 0;
    let currentPageContent: PageContent['categories'] = [];

    // Ottieni le interruzioni di pagina configurate
    const pageBreakCategoryIds = layout?.pageBreaks?.categoryIds || [];
    console.log('🔥 Interruzioni di pagina configurate per categorie:', pageBreakCategoryIds);

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

    const forcePageBreak = (categoryTitle: string) => {
      console.log('🔥 INTERRUZIONE FORZATA dopo categoria: ' + categoryTitle);
      addNewPage();
    };

    categories.forEach((category, categoryIndex) => {
      const categoryTitleHeight = measurements.categoryHeights.get(category.id) || 40;
      const relatedNoteIds = categoryNotesRelations[category.id] || [];
      const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
      
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
            categoryHeaderHeight += layout?.spacing.betweenCategories || 12;
          }

          // Controlla se l'header della categoria può entrare in questa pagina
          const availableHeight = getAvailableHeight(currentPageNumber);
          if (tempHeight + categoryHeaderHeight > availableHeight && currentPageContent.length > 0) {
            console.log('⚠️ Header categoria non entra (' + tempHeight.toFixed(2) + ' + ' + categoryHeaderHeight.toFixed(2) + ' > ' + availableHeight.toFixed(2) + '), nuova pagina');
            addNewPage();
            tempHeight = 0;
          }

          tempHeight += categoryHeaderHeight;
          categoryHeaderAddedOnCurrentPage = true;
        }

        // Prova ad aggiungere quanti più prodotti possibile in questa pagina
        for (let i = 0; i < remainingProducts.length; i++) {
          const product = remainingProducts[i];
          const productHeight = measurements.productHeights.get(product.id) || 45;
          let requiredHeight = productHeight;

          if (currentCategoryProducts.length > 0) {
            requiredHeight += layout?.spacing.betweenProducts || 4;
          }

          const availableHeight = getAvailableHeight(currentPageNumber);
          const safeRequiredHeight = requiredHeight * 1.05;
          
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
              fits: tempHeight + safeRequiredHeight <= availableHeight
            });
          }
          
          if (tempHeight + safeRequiredHeight <= availableHeight) {
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
            notes: !isRepeatedTitle ? relatedNotes : [],
            products: [...currentCategoryProducts],
            isRepeatedTitle
          });

          currentPageHeight = tempHeight;
          remainingProducts = remainingProducts.slice(currentCategoryProducts.length);
          
          console.log('✅ Aggiunti ' + currentCategoryProducts.length + ' prodotti, rimanenti: ' + remainingProducts.length + ', altezza pagina: ' + currentPageHeight.toFixed(2) + 'mm');
        }

        // Se ci sono ancora prodotti rimanenti, dovranno andare in una nuova pagina
        if (remainingProducts.length > 0) {
          console.log('📄 Prodotti rimanenti richiedono nuova pagina');
          addNewPage();
          categoryHeaderAddedOnCurrentPage = false;
        }
      }

      // 🔥 VERIFICA INTERRUZIONE DI PAGINA DOPO QUESTA CATEGORIA
      const shouldForcePageBreak = pageBreakCategoryIds.includes(category.id);
      const isLastCategory = categoryIndex === categories.length - 1;
      
      if (shouldForcePageBreak && !isLastCategory) {
        console.log('🔥 Interruzione di pagina configurata per categoria: ' + category.title);
        forcePageBreak(category.title);
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
