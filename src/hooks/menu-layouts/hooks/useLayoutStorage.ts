
import { useState, useEffect, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts } from "../storage";
import { toast } from "@/components/ui/sonner";
import { createDefaultLayout } from "../utils/operations/createDefaultLayout";
import { generateId } from "../utils/operations/idGenerator";

/**
 * Hook to load layouts from Supabase or default layouts
 * with improved caching and synchronization
 */
export const useLayoutStorage = () => {
  // Inizializza con array vuoto per evitare undefined
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());

  // Funzione per forzare un ricaricamento dei layout
  const forceRefresh = useCallback(() => {
    setCacheKey(Date.now().toString());
  }, []);

  // Load saved layouts from Supabase or default ones
  useEffect(() => {
    const fetchLayouts = async () => {
      setIsLoading(true);
      try {
        console.log("useLayoutStorage - Avvio caricamento layouts con cache key:", cacheKey);
        const { layouts: loadedLayouts, defaultLayout, error: loadError } = await loadLayouts();
        
        console.log("useLayoutStorage - Layout caricati:", loadedLayouts);
        console.log("useLayoutStorage - Default layout caricato:", defaultLayout);
        
        // Always ensure layouts is an array
        const safeLayouts = Array.isArray(loadedLayouts) ? loadedLayouts : [];
        
        // Assicuriamo che eventuali valori di colore esistenti non vengano persi
        // Questo previene il problema della visualizzazione errata dei colori
        const layoutsWithFixedColors = safeLayouts.map(layout => {
          // Verifica e correggi i colori eventualmente invalidi
          if (layout.elements?.category?.fontColor) {
            // Assicura che tutti i colori siano in formato esadecimale valido
            if (!layout.elements.category.fontColor.startsWith('#')) {
              layout.elements.category.fontColor = '#000000';
            }
          }
          return layout;
        });
        
        setLayouts(layoutsWithFixedColors);
        
        // Make sure defaultLayout exists
        setActiveLayout(defaultLayout || (layoutsWithFixedColors.length > 0 ? layoutsWithFixedColors[0] : null));
        
        if (loadError) {
          console.error("useLayoutStorage - Errore durante il caricamento:", loadError);
          setError(loadError);
          toast.error(loadError);
        }
      } catch (e) {
        console.error("Error loading layouts:", e);
        setError("Failed to load layouts");
        toast.error("Errore nel caricamento dei layout");
        
        // Set empty array as fallback
        setLayouts([]);
      } finally {
        setIsLoading(false);
        console.log("useLayoutStorage - Caricamento completato");
      }
    };
    
    fetchLayouts();
  }, [cacheKey]); // Ora dipende anche da cacheKey per forzare il refresh

  return {
    // Garantiamo che layouts sia sempre un array
    layouts: Array.isArray(layouts) ? layouts : [],
    setLayouts,
    activeLayout,
    setActiveLayout,
    isLoading,
    error,
    setError,
    forceRefresh // Funzione per ricaricare i layout
  };
};
