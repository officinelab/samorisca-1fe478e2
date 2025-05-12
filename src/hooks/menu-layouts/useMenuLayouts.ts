
import { useState, useEffect, useCallback } from 'react';
import { defaultLayouts } from './utils/defaultLayouts';
import { PrintLayout, ProductSchema } from '@/types/printLayout';
import { LAYOUTS_STORAGE_KEY } from './constants';
import { toast } from "@/components/ui/sonner";

export function useMenuLayouts() {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carica i layout dal localStorage all'avvio
  useEffect(() => {
    const loadLayouts = () => {
      try {
        const savedLayouts = localStorage.getItem(LAYOUTS_STORAGE_KEY);
        
        if (savedLayouts) {
          const parsedLayouts: PrintLayout[] = JSON.parse(savedLayouts);
          
          // Assicurati che ogni layout abbia un productSchema impostato
          const updatedLayouts = parsedLayouts.map(layout => ({
            ...layout,
            productSchema: layout.productSchema || 'schema1'
          }));
          
          setLayouts(updatedLayouts);
          
          // Se c'è un layout predefinito, impostalo come attivo
          const defaultLayout = updatedLayouts.find(layout => layout.isDefault);
          if (defaultLayout) {
            setActiveLayout(defaultLayout);
          }
        } else {
          // Se non ci sono layout salvati, usa quelli predefiniti
          setLayouts(defaultLayouts);
          
          // Imposta il primo layout predefinito come attivo
          const firstDefaultLayout = defaultLayouts.find(layout => layout.isDefault);
          if (firstDefaultLayout) {
            setActiveLayout(firstDefaultLayout);
          }
        }
      } catch (error) {
        console.error('Errore nel caricamento dei layout:', error);
        toast.error('Errore nel caricamento dei layout');
        
        // In caso di errore, usa i layout predefiniti
        setLayouts(defaultLayouts);
        
        // Imposta il primo layout predefinito come attivo
        const firstDefaultLayout = defaultLayouts.find(layout => layout.isDefault);
        if (firstDefaultLayout) {
          setActiveLayout(firstDefaultLayout);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLayouts();
  }, []);

  // Salva i layout nel localStorage ogni volta che cambiano
  useEffect(() => {
    if (!isLoading && layouts.length > 0) {
      try {
        localStorage.setItem(LAYOUTS_STORAGE_KEY, JSON.stringify(layouts));
      } catch (error) {
        console.error('Errore nel salvataggio dei layout:', error);
        toast.error('Errore nel salvataggio dei layout');
      }
    }
  }, [layouts, isLoading]);

  // Cambia il layout attivo
  const changeActiveLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
    }
  }, [layouts]);

  // Crea un nuovo layout
  const createLayout = useCallback((layout: PrintLayout) => {
    setLayouts(prev => [...prev, layout]);
    toast.success('Layout creato con successo');
    return layout.id;
  }, []);

  // Aggiorna un layout esistente
  const updateLayout = useCallback((layoutId: string, updatedLayout: PrintLayout) => {
    setLayouts(prev => 
      prev.map(layout => 
        layout.id === layoutId ? updatedLayout : layout
      )
    );
    
    // Aggiorna anche il layout attivo se necessario
    if (activeLayout && activeLayout.id === layoutId) {
      setActiveLayout(updatedLayout);
    }
    
    toast.success('Layout aggiornato con successo');
  }, [activeLayout]);

  // Elimina un layout
  const deleteLayout = useCallback((layoutId: string) => {
    // Non permettere di eliminare l'ultimo layout
    if (layouts.length <= 1) {
      toast.error('Impossibile eliminare l\'unico layout disponibile');
      return false;
    }
    
    // Non permettere di eliminare un layout predefinito
    const layoutToDelete = layouts.find(layout => layout.id === layoutId);
    if (layoutToDelete?.isDefault) {
      toast.error('Impossibile eliminare un layout predefinito');
      return false;
    }
    
    setLayouts(prev => prev.filter(layout => layout.id !== layoutId));
    
    // Se il layout eliminato era quello attivo, imposta il primo come attivo
    if (activeLayout && activeLayout.id === layoutId) {
      const firstLayout = layouts.find(layout => layout.id !== layoutId);
      if (firstLayout) {
        setActiveLayout(firstLayout);
      }
    }
    
    toast.success('Layout eliminato con successo');
    return true;
  }, [layouts, activeLayout]);

  // Imposta un layout come predefinito
  const setDefaultLayout = useCallback((layoutId: string) => {
    setLayouts(prev => 
      prev.map(layout => ({
        ...layout,
        isDefault: layout.id === layoutId
      }))
    );
    
    toast.success('Layout impostato come predefinito');
  }, []);

  return {
    layouts,
    activeLayout,
    isLoading,
    changeActiveLayout,
    createLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout
  };
}
