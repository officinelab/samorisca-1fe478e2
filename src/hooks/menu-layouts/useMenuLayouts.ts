
import { useState, useEffect, useCallback } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { loadLayouts, saveLayouts } from './storage';
import { toast } from '@/components/ui/sonner';

interface UseMenuLayoutsReturn {
  layouts: PrintLayout[];
  activeLayout: PrintLayout | null;
  isLoading: boolean;
  error: string | null;
  changeActiveLayout: (layoutId: string) => void;
  addLayout: (layout: PrintLayout) => void;
  updateLayout: (layout: PrintLayout) => void;
  deleteLayout: (layoutId: string) => void;
  forceRefresh: () => void;
}

export const useMenuLayouts = (): UseMenuLayoutsReturn => {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  // Load layouts from storage
  useEffect(() => {
    const loadLayoutsFromStorage = async () => {
      try {
        setIsLoading(true);
        const storedLayouts = loadLayouts();
        
        setLayouts(storedLayouts);
        
        // Set active layout to the default one or the first available
        if (storedLayouts.length > 0) {
          const defaultLayout = storedLayouts.find(layout => layout.isDefault);
          setActiveLayout(defaultLayout || storedLayouts[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading layouts:', err);
        setError('Errore nel caricamento dei layout');
        toast.error('Errore nel caricamento dei layout');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLayoutsFromStorage();
  }, [refreshCounter]);

  // Change active layout
  const changeActiveLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
    } else {
      console.warn(`Layout with ID ${layoutId} not found`);
      // If the layout isn't found, use the default or first available
      const defaultLayout = layouts.find(l => l.isDefault);
      setActiveLayout(defaultLayout || layouts[0] || null);
    }
  }, [layouts]);

  // Add a new layout
  const addLayout = useCallback((layout: PrintLayout) => {
    const updatedLayouts = [...layouts, layout];
    setLayouts(updatedLayouts);
    saveLayouts(updatedLayouts);
    toast.success(`Layout "${layout.name}" aggiunto`);
  }, [layouts]);

  // Update an existing layout
  const updateLayout = useCallback((updatedLayout: PrintLayout) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === updatedLayout.id ? updatedLayout : layout
    );
    
    setLayouts(updatedLayouts);
    
    // If the updated layout is the active one, update it
    if (activeLayout && activeLayout.id === updatedLayout.id) {
      setActiveLayout(updatedLayout);
    }
    
    saveLayouts(updatedLayouts);
    toast.success(`Layout "${updatedLayout.name}" aggiornato`);
  }, [layouts, activeLayout]);

  // Delete a layout
  const deleteLayout = useCallback((layoutId: string) => {
    const layoutToDelete = layouts.find(l => l.id === layoutId);
    if (!layoutToDelete) return;
    
    // Don't allow deleting if there's only one layout left
    if (layouts.length <= 1) {
      toast.error("Impossibile eliminare l'unico layout disponibile");
      return;
    }
    
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
    setLayouts(updatedLayouts);
    
    // If the deleted layout was the active one, switch to another
    if (activeLayout && activeLayout.id === layoutId) {
      const defaultLayout = updatedLayouts.find(l => l.isDefault);
      setActiveLayout(defaultLayout || updatedLayouts[0]);
    }
    
    saveLayouts(updatedLayouts);
    toast.success(`Layout "${layoutToDelete.name}" eliminato`);
  }, [layouts, activeLayout]);

  // Force a refresh of the layouts
  const forceRefresh = useCallback(() => {
    setRefreshCounter(prevCounter => prevCounter + 1);
  }, []);

  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    changeActiveLayout,
    addLayout,
    updateLayout,
    deleteLayout,
    forceRefresh
  };
};
