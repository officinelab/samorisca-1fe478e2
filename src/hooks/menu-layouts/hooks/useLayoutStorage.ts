
import { useState, useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts } from "../storage";
import { toast } from "@/components/ui/sonner";

/**
 * Hook to load layouts from localStorage or default layouts
 */
export const useLayoutStorage = () => {
  // Inizializza con array vuoto per evitare undefined
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aggiungiamo log per debug
  useEffect(() => {
    console.log("useLayoutStorage - Stato iniziale:", { layouts, activeLayout, isLoading });
  }, []);

  // Load saved layouts from localStorage or default ones
  useEffect(() => {
    const fetchLayouts = async () => {
      setIsLoading(true);
      try {
        console.log("useLayoutStorage - Avvio caricamento layouts");
        const { layouts: loadedLayouts, defaultLayout, error: loadError } = await loadLayouts();
        
        console.log("useLayoutStorage - Layout caricati:", loadedLayouts);
        console.log("useLayoutStorage - Default layout caricato:", defaultLayout);
        
        // Always ensure layouts is an array
        const safeLayouts = Array.isArray(loadedLayouts) ? loadedLayouts : [];
        setLayouts(safeLayouts);
        
        // Make sure defaultLayout exists
        setActiveLayout(defaultLayout || (safeLayouts.length > 0 ? safeLayouts[0] : null));
        
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
  }, []);

  // Aggiungiamo un effetto per debug dei cambiamenti
  useEffect(() => {
    console.log("useLayoutStorage - Layouts aggiornati:", layouts);
    console.log("useLayoutStorage - ActiveLayout aggiornato:", activeLayout);
  }, [layouts, activeLayout]);

  return {
    // Garantiamo che layouts sia sempre un array
    layouts: Array.isArray(layouts) ? layouts : [],
    setLayouts,
    activeLayout,
    setActiveLayout,
    isLoading,
    error,
    setError
  };
};
