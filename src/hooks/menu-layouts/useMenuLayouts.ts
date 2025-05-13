
import { useState, useEffect, useCallback } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { loadLayouts, saveLayouts } from './storage';
import { v4 as uuidv4 } from 'uuid'; // Assicurati che uuid sia installato
import { toast } from "@/components/ui/sonner";

/**
 * Hook per gestire i layout di stampa del menu
 */
export function useMenuLayouts() {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Carica i layout dal storage
  const fetchLayouts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { layouts: loadedLayouts, defaultLayout, error: loadError } = await loadLayouts();
      
      setLayouts(loadedLayouts);
      setActiveLayout(defaultLayout || (loadedLayouts.length > 0 ? loadedLayouts[0] : null));
      
      if (loadError) {
        setError(loadError);
        toast.error(`Errore nel caricamento dei layout: ${loadError}`);
      }
    } catch (err) {
      console.error("Errore durante il caricamento dei layout:", err);
      setError("Si è verificato un errore durante il caricamento dei layout.");
      toast.error("Si è verificato un errore durante il caricamento dei layout.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Forza un refresh dei layout
  const forceRefresh = useCallback(() => {
    console.log('Forcing refresh of layouts...');
    fetchLayouts();
  }, [fetchLayouts]);
  
  // Aggiorna un layout esistente
  const updateLayout = useCallback(async (updatedLayout: PrintLayout) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === updatedLayout.id ? updatedLayout : layout
    );
    
    setLayouts(updatedLayouts);
    
    // Se il layout aggiornato è quello attivo, aggiorna anche quello
    if (activeLayout?.id === updatedLayout.id) {
      setActiveLayout(updatedLayout);
    }
    
    // Se il layout aggiornato è predefinito, verifica che tutti gli altri non lo siano
    if (updatedLayout.isDefault) {
      const layoutWithDefaultsFixed = updatedLayouts.map(layout => ({
        ...layout,
        isDefault: layout.id === updatedLayout.id
      }));
      
      setLayouts(layoutWithDefaultsFixed);
      const { success } = await saveLayouts(layoutWithDefaultsFixed);
      return success;
    } else {
      const { success } = await saveLayouts(updatedLayouts);
      return success;
    }
  }, [layouts, activeLayout]);
  
  // Crea un nuovo layout
  const createLayout = useCallback(async (newLayout: PrintLayout) => {
    const updatedLayouts = [...layouts, newLayout];
    
    // Se il nuovo layout è predefinito, aggiorna gli altri layout
    if (newLayout.isDefault) {
      const layoutWithDefaultsFixed = updatedLayouts.map(layout => ({
        ...layout,
        isDefault: layout.id === newLayout.id
      }));
      
      setLayouts(layoutWithDefaultsFixed);
      const { success } = await saveLayouts(layoutWithDefaultsFixed);
      return success;
    } else {
      setLayouts(updatedLayouts);
      const { success } = await saveLayouts(updatedLayouts);
      return success;
    }
  }, [layouts]);
  
  // Elimina un layout
  const deleteLayout = useCallback(async (layoutId: string) => {
    const filteredLayouts = layouts.filter(layout => layout.id !== layoutId);
    
    // Non permettere di eliminare tutti i layout
    if (filteredLayouts.length === 0) {
      setError("Non è possibile eliminare tutti i layout.");
      return false;
    }
    
    // Se il layout eliminato era quello attivo, imposta come attivo il primo disponibile
    if (activeLayout?.id === layoutId) {
      // Trova il primo layout predefinito o usa il primo disponibile
      const newActiveLayout = filteredLayouts.find(layout => layout.isDefault) || filteredLayouts[0];
      setActiveLayout(newActiveLayout);
    }
    
    // Se il layout eliminato era quello predefinito, imposta come predefinito il primo disponibile
    const wasDefault = layouts.find(layout => layout.id === layoutId)?.isDefault || false;
    if (wasDefault && filteredLayouts.length > 0) {
      filteredLayouts[0].isDefault = true;
    }
    
    setLayouts(filteredLayouts);
    const { success } = await saveLayouts(filteredLayouts);
    return success;
  }, [layouts, activeLayout]);
  
  // Imposta un layout come attivo (cambio layout)
  const setActive = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
      return true;
    }
    return false;
  }, [layouts]);
  
  // Imposta un layout come predefinito
  const setDefault = useCallback(async (layoutId: string) => {
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isDefault: layout.id === layoutId
    }));
    
    setLayouts(updatedLayouts);
    
    // Aggiorna anche il layout attivo se necessario
    const newDefaultLayout = updatedLayouts.find(layout => layout.id === layoutId);
    if (newDefaultLayout) {
      setActiveLayout(newDefaultLayout);
    }
    
    const { success } = await saveLayouts(updatedLayouts);
    return success;
  }, [layouts]);
  
  // Clona un layout esistente
  const cloneLayout = useCallback(async (layoutId: string) => {
    const layoutToClone = layouts.find(l => l.id === layoutId);
    if (!layoutToClone) {
      setError("Layout da clonare non trovato");
      return null;
    }
    
    const clonedLayout: PrintLayout = {
      ...layoutToClone,
      id: uuidv4(),
      name: `${layoutToClone.name} (copia)`,
      isDefault: false
    };
    
    const updatedLayouts = [...layouts, clonedLayout];
    setLayouts(updatedLayouts);
    
    const { success } = await saveLayouts(updatedLayouts);
    if (success) {
      return clonedLayout;
    } else {
      setError("Errore durante il salvataggio del layout clonato");
      return null;
    }
  }, [layouts]);
  
  // Crea un nuovo layout vuoto (con template base)
  const createNewLayout = useCallback(async (name: string) => {
    // Template base per un nuovo layout
    const newLayout: PrintLayout = {
      id: uuidv4(),
      name: name,
      type: 'classic',
      isDefault: false,
      productSchema: 'schema1',
      elements: {
        category: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 16,
          fontColor: '#000000',
          fontStyle: 'bold',
          alignment: 'left',
          margin: { top: 10, right: 0, bottom: 5, left: 0 }
        },
        title: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 12,
          fontColor: '#000000',
          fontStyle: 'bold',
          alignment: 'left',
          margin: { top: 2, right: 0, bottom: 1, left: 0 }
        },
        description: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 10,
          fontColor: '#666666',
          fontStyle: 'italic',
          alignment: 'left',
          margin: { top: 2, right: 0, bottom: 2, left: 0 }
        },
        price: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 12,
          fontColor: '#000000',
          fontStyle: 'bold',
          alignment: 'right',
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        allergensList: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 9,
          fontColor: '#888888',
          fontStyle: 'italic',
          alignment: 'left',
          margin: { top: 1, right: 0, bottom: 1, left: 0 }
        },
        priceVariants: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 10,
          fontColor: '#666666',
          fontStyle: 'normal',
          alignment: 'right',
          margin: { top: 1, right: 0, bottom: 0, left: 0 }
        }
      },
      cover: {
        logo: {
          maxWidth: 60,
          maxHeight: 40,
          alignment: 'center',
          marginTop: 20,
          marginBottom: 20,
          visible: true
        },
        title: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 24,
          fontColor: '#000000',
          fontStyle: 'bold',
          alignment: 'center',
          margin: { top: 10, right: 0, bottom: 5, left: 0 }
        },
        subtitle: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 16,
          fontColor: '#666666',
          fontStyle: 'italic',
          alignment: 'center',
          margin: { top: 5, right: 0, bottom: 10, left: 0 }
        }
      },
      allergens: {
        title: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 18,
          fontColor: '#000000',
          fontStyle: 'bold',
          alignment: 'center',
          margin: { top: 10, right: 0, bottom: 5, left: 0 }
        },
        description: {
          visible: true,
          fontFamily: 'Arial',
          fontSize: 12,
          fontColor: '#666666',
          fontStyle: 'italic',
          alignment: 'center',
          margin: { top: 5, right: 0, bottom: 10, left: 0 }
        },
        item: {
          number: {
            visible: true,
            fontFamily: 'Arial',
            fontSize: 12,
            fontColor: '#ffffff',
            fontStyle: 'bold',
            alignment: 'center',
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          title: {
            visible: true,
            fontFamily: 'Arial',
            fontSize: 12,
            fontColor: '#000000',
            fontStyle: 'normal',
            alignment: 'left',
            margin: { top: 0, right: 0, bottom: 0, left: 10 }
          },
          spacing: 10,
          backgroundColor: '#666666',
          borderRadius: 50,
          padding: 5
        }
      },
      spacing: {
        betweenCategories: 20,
        betweenProducts: 10,
        categoryTitleBottomMargin: 10
      },
      page: {
        marginTop: 20,
        marginRight: 15,
        marginBottom: 20,
        marginLeft: 15,
        useDistinctMarginsForPages: false,
        oddPages: {
          marginTop: 20,
          marginRight: 15,
          marginBottom: 20,
          marginLeft: 15
        },
        evenPages: {
          marginTop: 20,
          marginRight: 15,
          marginBottom: 20,
          marginLeft: 15
        }
      }
    };
    
    const updatedLayouts = [...layouts, newLayout];
    setLayouts(updatedLayouts);
    
    const { success } = await saveLayouts(updatedLayouts);
    if (success) {
      return newLayout;
    } else {
      setError("Errore durante il salvataggio del nuovo layout");
      return null;
    }
  }, [layouts]);
  
  // Carica i layout all'avvio
  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);
  
  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    updateLayout,
    createLayout: createNewLayout,
    deleteLayout,
    setActive,
    setDefault,
    cloneLayout,
    createNewLayout,
    changeActiveLayout: setActive,
    refreshLayouts: fetchLayouts,
    forceRefresh
  };
}
