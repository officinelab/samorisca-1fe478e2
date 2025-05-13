
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PrintLayout } from '@/types/printLayout';
import { loadLayouts, saveLayouts } from './layoutStorage';
import { classicLayout } from './templates/classicLayout';
import { modernLayout } from './templates/modernLayout';
import { allergensLayout } from './templates/allergensLayout';
import { useLayoutStorage } from './hooks/useLayoutStorage';
import { useLayoutOperations } from './hooks/useLayoutOperations';
import { toast } from '@/components/ui/sonner';

export const useMenuLayouts = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayoutState] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const { loadStoredLayouts, saveLayoutsToStorage } = useLayoutStorage();
  const { 
    createLayout,
    deleteLayout,
    updateLayout, 
    setDefaultLayout 
  } = useLayoutOperations(layouts, setLayouts, saveLayoutsToStorage);

  // Load layouts on component initialization
  useEffect(() => {
    const initializeLayouts = async () => {
      try {
        setIsLoading(true);
        
        // Load layouts from storage
        const storedLayouts = await loadStoredLayouts();
        
        if (storedLayouts && storedLayouts.length > 0) {
          // If we have stored layouts, use them
          setLayouts(storedLayouts);
          
          // Set active layout to the default one or the first one
          const defaultLayout = storedLayouts.find(layout => layout.isDefault);
          setActiveLayoutState(defaultLayout || storedLayouts[0]);
        } else {
          // If no stored layouts, create default ones
          const defaultLayouts = [
            { ...classicLayout, id: uuidv4(), isDefault: true },
            { ...modernLayout, id: uuidv4(), isDefault: false },
            { ...allergensLayout, id: uuidv4(), isDefault: false }
          ];
          
          setLayouts(defaultLayouts);
          setActiveLayoutState(defaultLayouts[0]);
          
          // Save default layouts
          await saveLayoutsToStorage(defaultLayouts);
        }
      } catch (error) {
        console.error("Error initializing layouts:", error);
        toast.error("Errore durante il caricamento dei layout");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeLayouts();
  }, [lastRefresh]);

  // Function to add a new layout
  const addLayout = async (newLayout: Omit<PrintLayout, 'id'>) => {
    try {
      const layoutWithId = { ...newLayout, id: uuidv4() } as PrintLayout;
      
      // Add the new layout to the list
      const updatedLayouts = [...layouts, layoutWithId];
      setLayouts(updatedLayouts);
      
      // If this is the first layout, set it as active and default
      if (updatedLayouts.length === 1) {
        layoutWithId.isDefault = true;
        setActiveLayoutState(layoutWithId);
      }
      
      // Save the updated layouts
      await saveLayoutsToStorage(updatedLayouts);
      
      return layoutWithId;
    } catch (error) {
      console.error("Error adding layout:", error);
      toast.error("Errore durante l'aggiunta del layout");
      throw error;
    }
  };

  // Function to change active layout
  const setActiveLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayoutState(layout);
      return true;
    }
    return false;
  }, [layouts]);

  // Function to create a new layout based on a template
  const createNewLayout = async (name: string) => {
    try {
      // Create new layout with classic template
      const newLayout = {
        ...classicLayout,
        name,
        isDefault: false
      };
      
      return await addLayout(newLayout);
    } catch (error) {
      console.error("Error creating new layout:", error);
      toast.error("Errore durante la creazione del nuovo layout");
      throw error;
    }
  };

  // Function to clone an existing layout
  const cloneLayout = async (layoutId: string) => {
    try {
      const layoutToClone = layouts.find(l => l.id === layoutId);
      
      if (!layoutToClone) {
        throw new Error("Layout da clonare non trovato");
      }
      
      const clonedLayout = {
        ...layoutToClone,
        name: `${layoutToClone.name} (copia)`,
        isDefault: false,
      };
      
      return await addLayout(clonedLayout);
    } catch (error) {
      console.error("Error cloning layout:", error);
      toast.error("Errore durante la clonazione del layout");
      throw error;
    }
  };

  // Function to force refresh of layouts
  const forceRefresh = () => {
    setLastRefresh(Date.now());
  };

  return {
    layouts,
    activeLayout,
    isLoading,
    addLayout,
    createLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    setActiveLayout,
    createNewLayout,
    cloneLayout,
    forceRefresh
  };
};
