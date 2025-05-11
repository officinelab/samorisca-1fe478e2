
import { useState, useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts, saveLayouts } from "./layoutStorage";
import { 
  updateLayoutInList, 
  createNewLayoutFromTemplate,
  cloneExistingLayout,
  syncPageMargins
} from "./layoutOperations";

export const useMenuLayouts = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i layout salvati o quelli predefiniti
  useEffect(() => {
    setIsLoading(true);
    try {
      const { layouts: loadedLayouts, defaultLayout, error: loadError } = loadLayouts();
      
      setLayouts(loadedLayouts || []);
      setActiveLayout(defaultLayout);
      setError(loadError);
    } catch (e) {
      console.error("Error loading layouts:", e);
      setError("Failed to load layouts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aggiunge un nuovo layout
  const addLayout = (newLayout: Omit<PrintLayout, "id">) => {
    const id = Date.now().toString();
    const layoutWithId = { ...newLayout, id };
    
    // Se è impostato come predefinito, rimuovi il flag dagli altri
    let updatedLayouts = [...layouts];
    if (newLayout.isDefault) {
      updatedLayouts = updatedLayouts.map(layout => ({
        ...layout,
        isDefault: false
      }));
    }
    
    const newLayouts = [...updatedLayouts, layoutWithId];
    const { success, error: saveError } = saveLayouts(newLayouts);
    
    if (success) {
      setLayouts(newLayouts);
      
      if (newLayout.isDefault) {
        setActiveLayout(layoutWithId as PrintLayout);
      }
    } else {
      setError(saveError);
    }
    
    return layoutWithId;
  };

  // Aggiorna un layout esistente
  const updateLayout = (updatedLayout: PrintLayout) => {
    const updatedLayouts = updateLayoutInList(layouts, updatedLayout);
    const { success, error: saveError } = saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      const finalLayout = syncPageMargins(updatedLayout);
      if (finalLayout.isDefault || (activeLayout && activeLayout.id === finalLayout.id)) {
        setActiveLayout(finalLayout);
      }
    } else {
      setError(saveError);
    }
  };

  // Elimina un layout
  const deleteLayout = (layoutId: string) => {
    // Non permettere l'eliminazione se è l'unico layout rimasto
    if (layouts.length <= 1) {
      setError("Non puoi eliminare l'unico layout disponibile.");
      return false;
    }
    
    const layoutToDelete = layouts.find(layout => layout.id === layoutId);
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
    
    // Se stiamo eliminando il layout predefinito, imposta il primo come predefinito
    if (layoutToDelete && layoutToDelete.isDefault && updatedLayouts.length > 0) {
      updatedLayouts[0].isDefault = true;
    }
    
    const { success, error: saveError } = saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      // Se stiamo eliminando il layout attivo, imposta il primo come attivo
      if (activeLayout && activeLayout.id === layoutId) {
        const newActiveLayout = updatedLayouts.find(layout => layout.isDefault) || updatedLayouts[0];
        setActiveLayout(newActiveLayout);
      }
    } else {
      setError(saveError);
      return false;
    }
    
    return true;
  };

  // Imposta un layout come predefinito
  const setDefaultLayout = (layoutId: string) => {
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isDefault: layout.id === layoutId
    }));
    
    const { success, error: saveError } = saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      const newDefaultLayout = updatedLayouts.find(layout => layout.id === layoutId);
      if (newDefaultLayout) {
        setActiveLayout(newDefaultLayout);
      }
    } else {
      setError(saveError);
    }
  };

  // Clona un layout esistente
  const cloneLayout = (layoutId: string) => {
    const clonedLayout = cloneExistingLayout(layoutId, layouts);
    
    if (!clonedLayout) {
      setError("Layout non trovato.");
      return null;
    }
    
    const updatedLayouts = [...layouts, clonedLayout];
    const { success, error: saveError } = saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
    } else {
      setError(saveError);
      return null;
    }
    
    return clonedLayout;
  };

  // Cambia il layout attivo
  const changeActiveLayout = (layoutId: string) => {
    const newActiveLayout = layouts.find(layout => layout.id === layoutId);
    if (newActiveLayout) {
      setActiveLayout(newActiveLayout);
    }
  };

  // Crea un nuovo layout da zero
  const createNewLayout = (name: string) => {
    const newLayout = createNewLayoutFromTemplate(name, layouts);
    const updatedLayouts = [...layouts, newLayout];
    
    const { success, error: saveError } = saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
    } else {
      setError(saveError);
    }
    
    return newLayout;
  };

  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    addLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    changeActiveLayout,
    createNewLayout
  };
};
