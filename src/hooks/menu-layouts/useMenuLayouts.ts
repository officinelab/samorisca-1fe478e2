
import { useState, useEffect, useCallback } from 'react';
import { PrintLayout } from '@/types/printLayout';
import { defaultLayouts } from './defaultLayouts';
import { loadLayouts, saveLayouts } from './layoutStorage';
import { supabaseApi } from './services/supabaseLayoutService';
import { toast } from '@/components/ui/sonner';

export function useMenuLayouts() {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Carica i layout dal database o utilizza quelli predefiniti
  const fetchLayouts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Tenta di caricare i layout dal database
      const { data, error: apiError } = await supabaseApi.getLayouts();
      
      if (apiError) {
        throw new Error(apiError.message);
      }
      
      if (data && data.length > 0) {
        // Se ci sono layout nel database, usali
        setLayouts(data);
        
        // Trova il layout predefinito o usa il primo
        const defaultLayout = data.find(layout => layout.isDefault) || data[0];
        setActiveLayout(defaultLayout);
        console.log("Layout caricati dal database:", data.length);
      } else {
        // Se non ci sono layout nel database, usa quelli predefiniti
        setLayouts(defaultLayouts);
        setActiveLayout(defaultLayouts[0]);
        console.log("Utilizzo layout predefiniti");
        
        // Salva i layout predefiniti nel database
        await Promise.all(defaultLayouts.map(layout => 
          supabaseApi.createLayout(layout)
        ));
      }
    } catch (err) {
      console.error("Errore nel caricamento dei layout:", err);
      setError(`Si è verificato un errore durante il caricamento dei layout. Utilizzando i layout predefiniti.`);
      setLayouts(defaultLayouts);
      setActiveLayout(defaultLayouts[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inizializzazione
  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  // Funzione per impostare un layout come attivo
  const changeActiveLayout = useCallback((layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setActiveLayout(layout);
      return true;
    }
    return false;
  }, [layouts]);

  // Aggiorna un layout esistente
  const updateLayout = useCallback(async (updatedLayout: PrintLayout): Promise<boolean> => {
    try {
      const { error: saveError } = await supabaseApi.updateLayout(updatedLayout);
      
      if (saveError) {
        throw new Error(saveError.message);
      }
      
      // Aggiorna localmente
      setLayouts(prevLayouts => 
        prevLayouts.map(layout => 
          layout.id === updatedLayout.id ? updatedLayout : layout
        )
      );
      
      // Se il layout aggiornato è quello attivo, aggiorna anche activeLayout
      if (activeLayout && activeLayout.id === updatedLayout.id) {
        setActiveLayout(updatedLayout);
      }
      
      toast.success("Layout aggiornato con successo");
      return true;
    } catch (err) {
      console.error("Errore nell'aggiornamento del layout:", err);
      toast.error("Errore durante l'aggiornamento del layout");
      return false;
    }
  }, [activeLayout]);

  // Imposta un layout come predefinito
  const setDefaultLayout = useCallback(async (layoutId: string): Promise<boolean> => {
    try {
      // Prima rimuovi lo stato predefinito da tutti i layout
      for (const layout of layouts) {
        if (layout.isDefault) {
          const updatedLayout = { ...layout, isDefault: false };
          await supabaseApi.updateLayout(updatedLayout);
        }
      }
      
      // Poi imposta il nuovo layout predefinito
      const layoutToDefault = layouts.find(l => l.id === layoutId);
      if (layoutToDefault) {
        const updatedLayout = { ...layoutToDefault, isDefault: true };
        await supabaseApi.updateLayout(updatedLayout);
        
        // Aggiorna stato locale
        setLayouts(prevLayouts => 
          prevLayouts.map(layout => ({
            ...layout,
            isDefault: layout.id === layoutId
          }))
        );
        
        toast.success("Layout predefinito impostato");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Errore nell'impostare il layout predefinito:", err);
      toast.error("Errore durante l'impostazione del layout predefinito");
      return false;
    }
  }, [layouts]);

  // Clona un layout esistente
  const cloneLayout = useCallback(async (layoutId: string): Promise<boolean> => {
    try {
      const layoutToClone = layouts.find(l => l.id === layoutId);
      if (!layoutToClone) return false;
      
      // Crea una copia del layout
      const clonedLayout: Omit<PrintLayout, 'id'> = {
        ...layoutToClone,
        name: `${layoutToClone.name} (Copia)`,
        isDefault: false,
      };
      
      // Salva la copia nel database
      const { data: newLayout, error } = await supabaseApi.createLayout(clonedLayout);
      
      if (error || !newLayout) {
        throw new Error(error?.message || "Errore durante la clonazione");
      }
      
      // Aggiorna stato locale
      setLayouts(prevLayouts => [...prevLayouts, newLayout]);
      
      toast.success("Layout clonato con successo");
      return true;
    } catch (err) {
      console.error("Errore nella clonazione del layout:", err);
      toast.error("Errore durante la clonazione del layout");
      return false;
    }
  }, [layouts]);

  // Crea un nuovo layout
  const createNewLayout = useCallback(async (name: string): Promise<boolean> => {
    try {
      // Parte da un layout template (il primo predefinito)
      const templateLayout = defaultLayouts[0];
      const newLayoutData: Omit<PrintLayout, 'id'> = {
        ...templateLayout,
        name,
        isDefault: false,
      };
      
      // Crea il nuovo layout nel database
      const { data: newLayout, error } = await supabaseApi.createLayout(newLayoutData);
      
      if (error || !newLayout) {
        throw new Error(error?.message || "Errore durante la creazione");
      }
      
      // Aggiorna stato locale
      setLayouts(prevLayouts => [...prevLayouts, newLayout]);
      
      toast.success("Nuovo layout creato con successo");
      return true;
    } catch (err) {
      console.error("Errore nella creazione del layout:", err);
      toast.error("Errore durante la creazione del nuovo layout");
      return false;
    }
  }, []);

  // Elimina un layout
  const deleteLayout = useCallback(async (layoutId: string): Promise<boolean> => {
    try {
      const layoutToDelete = layouts.find(l => l.id === layoutId);
      if (!layoutToDelete) return false;
      
      // Non permette di eliminare l'ultimo layout rimasto
      if (layouts.length <= 1) {
        toast.error("Impossibile eliminare l'ultimo layout disponibile");
        return false;
      }
      
      // Non permette di eliminare il layout predefinito
      if (layoutToDelete.isDefault) {
        toast.error("Impossibile eliminare il layout predefinito. Imposta prima un altro layout come predefinito.");
        return false;
      }
      
      // Elimina il layout dal database
      const { error } = await supabaseApi.deleteLayout(layoutId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Aggiorna stato locale
      setLayouts(prevLayouts => prevLayouts.filter(l => l.id !== layoutId));
      
      // Se il layout eliminato era quello attivo, passa al predefinito o al primo disponibile
      if (activeLayout && activeLayout.id === layoutId) {
        const defaultLayout = layouts.find(l => l.isDefault && l.id !== layoutId);
        if (defaultLayout) {
          setActiveLayout(defaultLayout);
        } else if (layouts.length > 1) {
          const firstLayout = layouts.find(l => l.id !== layoutId);
          if (firstLayout) setActiveLayout(firstLayout);
        }
      }
      
      toast.success("Layout eliminato con successo");
      return true;
    } catch (err) {
      console.error("Errore nell'eliminazione del layout:", err);
      toast.error("Errore durante l'eliminazione del layout");
      return false;
    }
  }, [layouts, activeLayout]);

  // Funzione per forzare un aggiornamento dei layout
  const forceRefresh = useCallback(() => {
    if (activeLayout) {
      const refresh = { ...activeLayout };
      setActiveLayout(refresh);
    }
  }, [activeLayout]);

  // Funzione per ricaricare tutti i layout dal database
  const refreshLayouts = useCallback(async () => {
    return fetchLayouts();
  }, [fetchLayouts]);

  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    updateLayout,
    deleteLayout, 
    setDefaultLayout,
    cloneLayout,
    createNewLayout,
    changeActiveLayout,
    forceRefresh,
    refreshLayouts
  };
}
