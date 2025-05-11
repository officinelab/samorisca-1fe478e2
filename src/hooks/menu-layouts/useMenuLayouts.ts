
import { useState, useEffect } from "react";
import { PrintLayout } from "@/types/printLayout";
import { loadLayouts, saveLayouts } from "./layoutStorage";
import { 
  updateLayoutInList, 
  createNewLayoutFromTemplate,
  cloneExistingLayout,
  syncPageMargins
} from "./layoutOperations";
import { toast } from "@/components/ui/sonner";

export const useMenuLayouts = () => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i layout salvati da Supabase o quelli predefiniti
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

  // Aggiunge un nuovo layout
  const addLayout = async (newLayout: Omit<PrintLayout, "id">) => {
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
    const { success, error: saveError } = await saveLayouts(newLayouts);
    
    if (success) {
      setLayouts(newLayouts);
      
      if (newLayout.isDefault) {
        setActiveLayout(layoutWithId as PrintLayout);
      }
      
      toast.success("Layout aggiunto con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'aggiunta del layout");
    }
    
    return layoutWithId;
  };

  // Aggiorna un layout esistente
  const updateLayout = async (updatedLayout: PrintLayout) => {
    const updatedLayouts = updateLayoutInList(layouts, updatedLayout);
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      const finalLayout = syncPageMargins(updatedLayout);
      if (finalLayout.isDefault || (activeLayout && activeLayout.id === finalLayout.id)) {
        setActiveLayout(finalLayout);
      }
      
      toast.success("Layout aggiornato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'aggiornamento del layout");
    }
  };

  // Elimina un layout
  const deleteLayout = async (layoutId: string) => {
    // Non permettere l'eliminazione se è l'unico layout rimasto
    if (layouts.length <= 1) {
      setError("Non puoi eliminare l'unico layout disponibile.");
      toast.error("Non puoi eliminare l'unico layout disponibile");
      return false;
    }
    
    const layoutToDelete = layouts.find(layout => layout.id === layoutId);
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
    
    // Se stiamo eliminando il layout predefinito, imposta il primo come predefinito
    if (layoutToDelete && layoutToDelete.isDefault && updatedLayouts.length > 0) {
      updatedLayouts[0].isDefault = true;
    }
    
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      // Se stiamo eliminando il layout attivo, imposta il primo come attivo
      if (activeLayout && activeLayout.id === layoutId) {
        const newActiveLayout = updatedLayouts.find(layout => layout.isDefault) || updatedLayouts[0];
        setActiveLayout(newActiveLayout);
      }
      
      toast.success("Layout eliminato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'eliminazione del layout");
      return false;
    }
    
    return true;
  };

  // Imposta un layout come predefinito
  const setDefaultLayout = async (layoutId: string) => {
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isDefault: layout.id === layoutId
    }));
    
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      
      const newDefaultLayout = updatedLayouts.find(layout => layout.id === layoutId);
      if (newDefaultLayout) {
        setActiveLayout(newDefaultLayout);
      }
      
      toast.success("Layout impostato come predefinito");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante l'impostazione del layout predefinito");
    }
  };

  // Clona un layout esistente
  const cloneLayout = async (layoutId: string) => {
    const clonedLayout = cloneExistingLayout(layoutId, layouts);
    
    if (!clonedLayout) {
      setError("Layout non trovato.");
      toast.error("Layout non trovato");
      return null;
    }
    
    const updatedLayouts = [...layouts, clonedLayout];
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      toast.success("Layout clonato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante la clonazione del layout");
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
  const createNewLayout = async (name: string) => {
    const newLayout = createNewLayoutFromTemplate(name, layouts);
    const updatedLayouts = [...layouts, newLayout];
    
    const { success, error: saveError } = await saveLayouts(updatedLayouts);
    
    if (success) {
      setLayouts(updatedLayouts);
      toast.success("Nuovo layout creato con successo");
    } else {
      setError(saveError);
      toast.error(saveError || "Errore durante la creazione del nuovo layout");
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
