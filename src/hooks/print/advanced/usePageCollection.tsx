
import { useCallback } from 'react';

export const usePageCollection = () => {
  const collectPages = useCallback((previewContainer: Element) => {
    // Raccogli le pagine in ordine specifico
    const coverPages = previewContainer.querySelectorAll('[data-page-preview^="cover"]');
    const contentPages = previewContainer.querySelectorAll('[data-page-preview^="content"]');
    
    // Correggi i selettori per le pagine allergeni
    // Prima prova a trovare il container principale delle pagine allergeni
    const allergensMainContainer = previewContainer.querySelector('[data-page-preview="allergens-pages"]');
    let allergensPageElements: Element[] = [];
    
    if (allergensMainContainer) {
      // Cerca tutte le singole pagine allergeni all'interno del container
      const allergensPages = allergensMainContainer.querySelectorAll('[data-page-preview^="allergens-"]');
      allergensPageElements = Array.from(allergensPages);
      console.log('📄 Trovate pagine allergeni nel container principale:', allergensPageElements.length);
    } else {
      // Fallback: cerca direttamente nel preview container con selettori alternativi
      const directAllergensPages = previewContainer.querySelectorAll('[data-page-preview^="allergens-"]');
      allergensPageElements = Array.from(directAllergensPages);
      console.log('📄 Trovate pagine allergeni (ricerca diretta):', allergensPageElements.length);
    }

    // Se ancora non troviamo le pagine allergeni, proviamo un approccio più ampio
    if (allergensPageElements.length === 0) {
      // Cerca elementi che contengono "allergens" nell'attributo data-page-preview
      const allElementsWithData = previewContainer.querySelectorAll('[data-page-preview*="allergens"]');
      console.log('📄 Elementi trovati con "allergens" nel data-page-preview:', allElementsWithData.length);
      
      // Filtra per trovare solo le pagine individuali
      allergensPageElements = Array.from(allElementsWithData).filter(el => {
        const attr = el.getAttribute('data-page-preview');
        return attr && attr.match(/allergens-\d+/);
      });
      
      console.log('📄 Pagine allergeni filtrate:', allergensPageElements.length);
    }

    console.log('📄 Pagine trovate per la stampa:', {
      cover: coverPages.length,
      content: contentPages.length,
      allergens: allergensPageElements.length
    });

    // Debug: stampa i selettori trovati
    console.log('📄 Selettori cover trovati:', Array.from(coverPages).map(p => p.getAttribute('data-page-preview')));
    console.log('📄 Selettori content trovati:', Array.from(contentPages).map(p => p.getAttribute('data-page-preview')));
    console.log('📄 Selettori allergens trovati:', allergensPageElements.map(p => p.getAttribute('data-page-preview')));

    // Raccogli tutte le pagine in ordine
    const allPages: Element[] = [];
    
    // Aggiungi pagine cover
    coverPages.forEach(page => {
      console.log('📄 Aggiunta pagina cover:', page.getAttribute('data-page-preview'));
      allPages.push(page);
    });
    
    // Aggiungi pagine contenuto  
    contentPages.forEach(page => {
      console.log('📄 Aggiunta pagina contenuto:', page.getAttribute('data-page-preview'));
      allPages.push(page);
    });
    
    // Aggiungi pagine allergeni
    allergensPageElements.forEach(page => {
      console.log('📄 Aggiunta pagina allergeni:', page.getAttribute('data-page-preview'));
      allPages.push(page);
    });

    console.log('📄 Totale pagine da stampare:', allPages.length);

    return allPages;
  }, []);

  return { collectPages };
};
