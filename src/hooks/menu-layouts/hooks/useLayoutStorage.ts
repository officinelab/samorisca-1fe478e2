
import { useState, useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts } from "../storage";
import { toast } from "@/components/ui/sonner";

/**
 * Hook per caricare i layout da localStorage o default layouts
 */
export const useLayoutStorage = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i layout salvati dal localStorage o quelli predefiniti
  useEffect(() => {
    const fetchLayouts = async () => {
      setIsLoading(true);
      try {
        const { layouts: loadedLayouts, defaultLayout, error: loadError } = await loadLayouts();
        
        setLayouts(loadedLayouts || []);
        setActiveLayout(defaultLayout);
        
        if (loadError) {
          setError(loadError);
          toast.error(loadError);
        }
      } catch (e) {
        console.error("Error loading layouts:", e);
        setError("Failed to load layouts");
        toast.error("Errore nel caricamento dei layout");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLayouts();
  }, []);

  return {
    layouts,
    setLayouts,
    activeLayout,
    setActiveLayout,
    isLoading,
    error,
    setError
  };
};
