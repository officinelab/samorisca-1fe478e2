
import { useState, useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts, saveLayouts } from "../layoutStorage";
import { createDefaultLayout } from "../utils/operations/createDefaultLayout";
import { generateUniqueId } from "../utils/operations/idGenerator";

export const useLayoutStorage = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initLayouts = async () => {
      try {
        setIsLoading(true);
        
        // Try to load existing layouts
        const { layouts: existingLayouts, error: loadError } = await loadLayouts();
        
        // If no layouts exist, create default layout
        if (!existingLayouts || !Array.isArray(existingLayouts) || existingLayouts.length === 0) {
          const newDefaultLayout = createDefaultLayout();
          const layoutWithId = {
            ...newDefaultLayout,
            id: generateUniqueId(),
          };
          
          await saveLayouts([layoutWithId]);
          setLayouts([layoutWithId]);
          setActiveLayout(layoutWithId);
        } else {
          setLayouts(existingLayouts);
          
          // Find the default layout or set the first one as default
          const foundDefault = existingLayouts.find(layout => layout.isDefault);
          if (foundDefault) {
            setActiveLayout(foundDefault);
          } else if (existingLayouts.length > 0) {
            const firstLayout = existingLayouts[0];
            const updatedFirstLayout = { ...firstLayout, isDefault: true };
            const updatedLayouts = [
              updatedFirstLayout,
              ...existingLayouts.slice(1).map(l => ({ ...l, isDefault: false }))
            ];
            
            await saveLayouts(updatedLayouts);
            setLayouts(updatedLayouts);
            setActiveLayout(updatedFirstLayout);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error initializing layouts:", err);
        setError("Impossibile caricare i layout. Riprovare più tardi.");
        
        // Create an emergency default layout if loading fails
        const emergencyLayout = createDefaultLayout();
        const layoutWithId = {
          ...emergencyLayout,
          id: generateUniqueId(),
        };
        
        setLayouts([layoutWithId]);
        setActiveLayout(layoutWithId);
      } finally {
        setIsLoading(false);
      }
    };
    
    initLayouts();
  }, []);

  // Force a refresh of the layouts
  const forceRefresh = async () => {
    setIsLoading(true);
    try {
      const { layouts: refreshedLayouts } = await loadLayouts();
      if (Array.isArray(refreshedLayouts) && refreshedLayouts.length > 0) {
        setLayouts(refreshedLayouts);
        
        // Update active layout
        const currentActiveId = activeLayout?.id;
        if (currentActiveId) {
          const updatedActive = refreshedLayouts.find(l => l.id === currentActiveId);
          if (updatedActive) {
            setActiveLayout(updatedActive);
          } else {
            setActiveLayout(refreshedLayouts[0]);
          }
        } else {
          setActiveLayout(refreshedLayouts[0]);
        }
      }
    } catch (err) {
      console.error("Error refreshing layouts:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    layouts, 
    setLayouts, 
    activeLayout, 
    setActiveLayout, 
    isLoading, 
    error, 
    setError,
    forceRefresh 
  };
};

export default useLayoutStorage;
