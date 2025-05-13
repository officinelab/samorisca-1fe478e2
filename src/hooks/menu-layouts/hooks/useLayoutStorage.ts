
import { useState, useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts, saveLayouts } from "../layoutStorage";
import { createDefaultLayout } from "../utils/operations/createDefaultLayout";
import { generateUniqueId } from "../utils/operations/idGenerator";

export const useLayoutStorage = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [defaultLayout, setDefaultLayout] = useState<PrintLayout | null>(null);

  useEffect(() => {
    const initLayouts = async () => {
      try {
        setIsLoading(true);
        
        // Try to load existing layouts
        const existingLayouts = await loadLayouts();
        
        // If no layouts exist, create default layout
        if (!existingLayouts || !existingLayouts.length) {
          const newDefaultLayout = createDefaultLayout();
          const layoutWithId = {
            ...newDefaultLayout,
            id: generateUniqueId(),
          };
          
          await saveLayouts([layoutWithId]);
          setLayouts([layoutWithId]);
          setDefaultLayout(layoutWithId);
        } else {
          setLayouts(existingLayouts);
          
          // Find the default layout or set the first one as default
          const foundDefault = existingLayouts.find(layout => layout.isDefault);
          if (foundDefault) {
            setDefaultLayout(foundDefault);
          } else if (existingLayouts.length > 0) {
            const firstLayout = existingLayouts[0];
            const updatedFirstLayout = { ...firstLayout, isDefault: true };
            const updatedLayouts = [
              updatedFirstLayout,
              ...existingLayouts.slice(1).map(l => ({ ...l, isDefault: false }))
            ];
            
            await saveLayouts(updatedLayouts);
            setLayouts(updatedLayouts);
            setDefaultLayout(updatedFirstLayout);
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
        setDefaultLayout(layoutWithId);
      } finally {
        setIsLoading(false);
      }
    };
    
    initLayouts();
  }, []);
  
  return { layouts, defaultLayout, error, isLoading };
};

export default useLayoutStorage;
