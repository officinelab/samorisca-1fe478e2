
import { useState, useEffect, useCallback } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { loadLayouts, saveLayouts } from './storage';

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
      }
    } catch (err) {
      console.error("Errore durante il caricamento dei layout:", err);
      setError("Si è verificato un errore durante il caricamento dei layout.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
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
  
  // Imposta un layout come attivo
  const setActive = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
    }
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
    createLayout,
    deleteLayout,
    setActive,
    setDefault,
    refreshLayouts: fetchLayouts
  };
}
