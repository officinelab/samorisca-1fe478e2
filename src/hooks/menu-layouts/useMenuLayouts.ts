// Re-export from the legacy import
import { useState, useEffect, useCallback } from "react";
import { PrintLayout } from "@/types/printLayout";
import { LAYOUTS_STORAGE_KEY } from "./constants";
import { defaultLayouts } from "./defaultLayouts";

export const useMenuLayouts = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Carica i layout dal localStorage
  useEffect(() => {
    const loadLayouts = () => {
      try {
        setIsLoading(true);
        const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
        
        if (savedLayouts) {
          const parsedLayouts = JSON.parse(savedLayouts);
          setLayouts(parsedLayouts);
          
          // Trova layout attivo o usa il primo
          const defaultLayout = parsedLayouts.find((l: PrintLayout) => l.isDefault);
          setActiveLayout(defaultLayout || parsedLayouts[0] || null);
        } else {
          // Se non ci sono layout salvati, usa quelli predefiniti
          setLayouts(defaultLayouts);
          setActiveLayout(defaultLayouts[0]);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei layout:", err);
        setError("Errore nel caricamento dei layout");
        // Fallback ai layout predefiniti
        setLayouts(defaultLayouts);
        setActiveLayout(defaultLayouts[0]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLayouts();
  }, []);

  // Cambia il layout attivo
  const changeActiveLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
    }
  }, [layouts]);
  
  // Force a refresh of the layouts (useful for cache issues)
  const forceRefresh = useCallback(() => {
    // Save current active layout ID
    const currentActiveId = activeLayout?.id;
    
    // Force a re-render by setting to loading and back
    setIsLoading(true);
    
    // Small timeout to ensure state changes are processed
    setTimeout(() => {
      try {
        // Re-load from localStorage
        const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
        
        if (savedLayouts) {
          const parsedLayouts = JSON.parse(savedLayouts);
          setLayouts(parsedLayouts);
          
          // Restore active layout
          if (currentActiveId) {
            const layout = parsedLayouts.find((l: PrintLayout) => l.id === currentActiveId);
            setActiveLayout(layout || parsedLayouts[0]);
          } else {
            const defaultLayout = parsedLayouts.find((l: PrintLayout) => l.isDefault);
            setActiveLayout(defaultLayout || parsedLayouts[0]);
          }
        } else {
          // If no saved layouts, use defaults
          setLayouts(defaultLayouts);
          setActiveLayout(defaultLayouts[0]);
        }
      } catch (err) {
        console.error("Error refreshing layouts:", err);
      } finally {
        setIsLoading(false);
      }
    }, 50);
  }, [activeLayout?.id]);

  // Other methods would go here (e.g., createLayout, updateLayout, etc.)

  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    changeActiveLayout,
    forceRefresh, // Add the forceRefresh function
    // Additional operations would be included here
  };
};

export default useMenuLayouts;
