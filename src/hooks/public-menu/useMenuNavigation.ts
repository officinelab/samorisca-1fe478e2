
import { useState, useRef, useEffect, useCallback } from "react";

export const useMenuNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Funzione per aspettare che le immagini siano caricate
  const waitForImages = async (): Promise<void> => {
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      
      return new Promise<void>((resolve) => {
        const handleLoad = () => {
          img.removeEventListener('load', handleLoad);
          img.removeEventListener('error', handleLoad);
          resolve();
        };
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleLoad);
        
        // Timeout di sicurezza
        setTimeout(handleLoad, 2000);
      });
    });
    
    await Promise.all(imagePromises);
  };
  
  // Funzione per calcolare dinamicamente l'offset totale (chiamata al momento giusto)
  const calculateStickyOffset = async (): Promise<number> => {
    // Aspetta un frame per essere sicuri che il layout sia stabile
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    
    let totalOffset = 0;
    
    // Header principale
    const header = document.querySelector('header') as HTMLElement;
    if (header) {
      totalOffset += header.offsetHeight;
      console.log('Header height:', header.offsetHeight);
    }
    
    // CategorySidebar mobile
    const categorySidebar = document.querySelector('.sticky.top-\\[76px\\]') as HTMLElement || 
                           document.querySelector('[class*="sticky"][class*="top-"]') as HTMLElement;
    if (categorySidebar) {
      totalOffset += categorySidebar.offsetHeight;
      console.log('CategorySidebar height:', categorySidebar.offsetHeight);
    }
    
    // Padding extra per sicurezza
    const extraPadding = 20;
    totalOffset += extraPadding;
    
    console.log('Total calculated offset:', totalOffset);
    return totalOffset;
  };
  
  // Set initial category when categories are loaded
  const initializeCategory = (categoryId: string | null) => {
    if (categoryId && !selectedCategory) {
      setSelectedCategory(categoryId);
    }
  };

  // Auto-highlight category based on scroll position
  const setupScrollHighlighting = useCallback(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Aspetta che tutto sia renderizzato prima di configurare l'observer
    const setupObserver = async () => {
      // Aspetta le immagini
      await waitForImages();
      
      // Calcola l'offset dinamico
      const dynamicOffset = await calculateStickyOffset();
      const rootMargin = `-${dynamicOffset}px 0px -40% 0px`;
      console.log('Using rootMargin:', rootMargin);

      // Create new intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          if (isManualScroll) return;
          
          // Trova tutte le categorie visibili
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
              // Se una categoria è al top del viewport (o molto vicina), ha priorità
              const aTop = a.boundingClientRect.top;
              const bTop = b.boundingClientRect.top;
              
              // Priorità alla categoria più vicina al top del viewport
              if (Math.abs(aTop) < 50) return -1;
              if (Math.abs(bTop) < 50) return 1;
              
              // Altrimenti ordina per posizione verticale
              return aTop - bTop;
            });
          
          if (visibleEntries.length > 0) {
            const categoryId = visibleEntries[0].target.id.replace('category-', '');
            console.log('Auto-selecting category:', categoryId);
            setSelectedCategory(categoryId);
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          rootMargin: rootMargin
        }
      );

      observerRef.current = observer;

      // Osserva tutte le sezioni categoria
      const categoryElements = document.querySelectorAll('[id^="category-"]');
      console.log('Observing', categoryElements.length, 'category elements');
      categoryElements.forEach((element) => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    // Delay più lungo per essere sicuri
    setTimeout(setupObserver, 500);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isManualScroll]);

  // Handle scroll to detect when to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Setup intersection observer for auto-highlighting
  useEffect(() => {
    const cleanup = setupScrollHighlighting();
    return cleanup;
  }, [setupScrollHighlighting]);
  
  // Scroll to selected category (manual selection) con retry mechanism
  const scrollToCategory = async (categoryId: string) => {
    console.log('Manual scroll to category:', categoryId);
    setIsManualScroll(true);
    setSelectedCategory(categoryId);
    
    const element = document.getElementById(`category-${categoryId}`);
    if (!element) {
      console.error('Element not found:', `category-${categoryId}`);
      setIsManualScroll(false);
      return;
    }

    // Funzione di scroll con retry
    const performScroll = async (attempt: number = 1): Promise<void> => {
      try {
        // Aspetta che tutto sia pronto
        await waitForImages();
        
        // Calcola l'offset dinamicamente
        const dynamicOffset = await calculateStickyOffset();
        
        // Calcola la posizione finale
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const scrollToPosition = absoluteElementTop - dynamicOffset;
        
        console.log(`Scroll attempt ${attempt}:`, {
          elementTop: elementRect.top,
          pageYOffset: window.pageYOffset,
          dynamicOffset,
          scrollToPosition,
          elementId: element.id
        });
        
        // Scroll con animazione
        window.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        });
        
        // Verifica se lo scroll è andato a buon fine dopo l'animazione
        setTimeout(async () => {
          const newScrollPosition = window.pageYOffset;
          const tolerance = 50; // tolleranza di 50px
          
          if (Math.abs(newScrollPosition - scrollToPosition) > tolerance && attempt < 3) {
            console.log(`Scroll attempt ${attempt} failed, retrying...`);
            await performScroll(attempt + 1);
          } else {
            console.log(`Scroll completed after ${attempt} attempt(s)`);
          }
        }, 1000); // Aspetta che l'animazione finisca
        
      } catch (error) {
        console.error('Error during scroll:', error);
      }
    };
    
    // Avvia lo scroll con un piccolo delay
    setTimeout(() => performScroll(), 150);
    
    // Reset manual scroll flag dopo più tempo per permettere i retry
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      console.log('Resetting manual scroll flag');
      setIsManualScroll(false);
    }, 3000); // Aumentato per permettere i retry
  };
  
  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    selectedCategory,
    setSelectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting
  };
};
