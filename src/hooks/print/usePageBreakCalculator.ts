
import { useRef, useState, useEffect } from 'react';
import { PrintLayout } from '@/types/printLayout';

interface PageBreakOptions {
  A4_HEIGHT_MM: number;
  pageMarginTop: number;
  pageMarginBottom: number;
  containerRef: React.RefObject<HTMLDivElement>;
  customLayout?: PrintLayout | null;
}

/**
 * Hook che calcola dove inserire i salti di pagina in base all'altezza della pagina A4
 * e ai contenuti del menu, rispettando i margini definiti nel layout
 */
export const usePageBreakCalculator = ({
  A4_HEIGHT_MM,
  pageMarginTop,
  pageMarginBottom,
  containerRef,
  customLayout
}: PageBreakOptions) => {
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  
  // Fattore di conversione più preciso da mm a px (può variare leggermente tra browser)
  // Aggiungiamo un fattore di correzione per garantire una migliore precisione
  const MM_TO_PX = 3.85; // Aumentato leggermente per garantire una migliore precisione
  
  // Calcola l'altezza effettiva disponibile per il contenuto in una pagina
  const getPageContentHeight = (pageIndex: number): number => {
    // Determina se usare margini personalizzati per pagine pari/dispari
    if (customLayout?.page.useDistinctMarginsForPages) {
      // Margini per pagina dispari (pageIndex 0, 2, 4... corrispondono alle pagine 1, 3, 5...)
      if (pageIndex % 2 === 0) {
        const topMargin = customLayout.page.oddPages?.marginTop || customLayout.page.marginTop;
        const bottomMargin = customLayout.page.oddPages?.marginBottom || customLayout.page.marginBottom;
        // Usa il margine inferiore stesso come margine di sicurezza
        return (A4_HEIGHT_MM - topMargin - bottomMargin - bottomMargin) * MM_TO_PX;
      } 
      // Margini per pagina pari (pageIndex 1, 3, 5... corrispondono alle pagine 2, 4, 6...)
      else {
        const topMargin = customLayout.page.evenPages?.marginTop || customLayout.page.marginTop;
        const bottomMargin = customLayout.page.evenPages?.marginBottom || customLayout.page.marginBottom;
        // Usa il margine inferiore stesso come margine di sicurezza
        return (A4_HEIGHT_MM - topMargin - bottomMargin - bottomMargin) * MM_TO_PX;
      }
    }
    
    // Se non sono specificati margini diversi, usa i margini standard
    // e il margine inferiore come margine di sicurezza
    return (A4_HEIGHT_MM - pageMarginTop - pageMarginBottom - pageMarginBottom) * MM_TO_PX;
  };

  // Funzione per calcolare i punti di interruzione di pagina
  const calculatePageBreaks = () => {
    if (!containerRef.current) return [];
    
    const container = containerRef.current;
    const categoryElements = container.querySelectorAll('.category');
    const productElements = container.querySelectorAll('.menu-item');
    
    if (categoryElements.length === 0 && productElements.length === 0) return [];
    
    // Altezza totale disponibile per il contenuto nella prima pagina
    let availableHeight = getPageContentHeight(0);
    let currentHeight = 0;
    const breaks: number[] = [];
    
    // Scansione di tutte le categorie e i prodotti per determinare i punti di interruzione
    Array.from(categoryElements).forEach((category) => {
      const categoryHeight = (category as HTMLElement).offsetHeight;
      const products = category.querySelectorAll('.menu-item');
      
      // Se l'intera categoria (titolo + tutti i prodotti) sta nella pagina corrente
      if (currentHeight + categoryHeight <= availableHeight) {
        currentHeight += categoryHeight;
      } 
      // Altrimenti, dobbiamo suddividere la categoria su più pagine
      else {
        // Considera il titolo della categoria e i singoli prodotti
        const categoryTitle = category.querySelector('.category-title');
        const categoryTitleHeight = categoryTitle ? (categoryTitle as HTMLElement).offsetHeight : 0;
        
        if (currentHeight + categoryTitleHeight > availableHeight) {
          // Inserisci un'interruzione di pagina prima del titolo della categoria
          breaks.push(currentHeight);
          // Aggiorna l'altezza disponibile per la nuova pagina
          availableHeight = getPageContentHeight(breaks.length);
          currentHeight = categoryTitleHeight;
        } else {
          // Il titolo della categoria sta nella pagina corrente
          currentHeight += categoryTitleHeight;
        }
        
        // Scansione dei prodotti di questa categoria
        Array.from(products).forEach((product) => {
          const productHeight = (product as HTMLElement).offsetHeight;
          
          // Se il prodotto non sta nella pagina corrente, crea un'interruzione
          if (currentHeight + productHeight > availableHeight) {
            breaks.push(currentHeight);
            // Aggiorna l'altezza disponibile per la nuova pagina
            availableHeight = getPageContentHeight(breaks.length);
            
            // Nella nuova pagina dobbiamo ripetere il titolo della categoria
            currentHeight = categoryTitleHeight + productHeight;
          } else {
            currentHeight += productHeight;
          }
        });
      }
    });
    
    return breaks;
  };
  
  // Calcola i punti di interruzione quando il contenuto cambia
  useEffect(() => {
    // Usa un timeout per assicurarti che il DOM sia completamente renderizzato
    const timer = setTimeout(() => {
      const breaks = calculatePageBreaks();
      setPageBreaks(breaks);
      console.log("Calcolati punti di interruzione pagina:", breaks);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [containerRef.current, customLayout]);
  
  return { pageBreaks };
};

export default usePageBreakCalculator;
