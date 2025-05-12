
import { useState, useEffect, useCallback } from 'react';
import { defaultLayouts } from './utils/defaultLayouts';
import { PrintLayout, ProductSchema } from '@/types/printLayout';
import { LAYOUTS_STORAGE_KEY } from './constants';
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from 'uuid';

export function useMenuLayouts() {
  const [layouts, setLayouts] = useState<PrintLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<PrintLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          } else if (updatedLayouts.length > 0) {
            setActiveLayout(updatedLayouts[0]);
          }
        } else {
          // Se non ci sono layout salvati, usa quelli predefiniti
          setLayouts(defaultLayouts);
          
          // Imposta il primo layout predefinito come attivo
          const firstDefaultLayout = defaultLayouts.find(layout => layout.isDefault);
          if (firstDefaultLayout) {
            setActiveLayout(firstDefaultLayout);
          } else if (defaultLayouts.length > 0) {
            setActiveLayout(defaultLayouts[0]);
          }
        }
      } catch (error) {
        console.error('Errore nel caricamento dei layout:', error);
        setError('Errore nel caricamento dei layout');
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
        setError('Errore nel salvataggio dei layout');
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
  const updateLayout = useCallback((updatedLayout: PrintLayout) => {
    setLayouts(prev => 
      prev.map(layout => 
        layout.id === updatedLayout.id ? updatedLayout : layout
      )
    );
    
    // Aggiorna anche il layout attivo se necessario
    if (activeLayout && activeLayout.id === updatedLayout.id) {
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

  // Clona un layout esistente
  const cloneLayout = useCallback((layoutId: string) => {
    const layoutToClone = layouts.find(l => l.id === layoutId);
    
    if (!layoutToClone) {
      toast.error('Layout non trovato');
      return null;
    }
    
    const clonedLayout: PrintLayout = {
      ...layoutToClone,
      id: uuidv4(),
      name: `${layoutToClone.name} (copia)`,
      isDefault: false
    };
    
    setLayouts(prev => [...prev, clonedLayout]);
    toast.success('Layout clonato con successo');
    return clonedLayout;
  }, [layouts]);

  // Crea un nuovo layout da zero
  const createNewLayout = useCallback((name: string) => {
    const newLayout: PrintLayout = {
      id: uuidv4(),
      name,
      type: 'custom',
      isDefault: false,
      productSchema: 'schema1',
      elements: {
        category: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 18,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 5, left: 0 }
        },
        title: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 2, left: 0 }
        },
        description: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#666666",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 5, left: 0 }
        },
        price: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "right",
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        allergensList: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 10,
          fontColor: "#888888",
          fontStyle: "italic",
          alignment: "left",
          margin: { top: 2, right: 0, bottom: 0, left: 0 }
        },
        priceVariants: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 12,
          fontColor: "#000000",
          fontStyle: "normal",
          alignment: "right",
          margin: { top: 2, right: 0, bottom: 0, left: 0 }
        }
      },
      spacing: {
        betweenCategories: 15,
        betweenProducts: 10,
        categoryTitleBottomMargin: 5
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
      },
      cover: {
        logo: {
          maxWidth: 80,
          maxHeight: 50,
          alignment: 'center',
          marginTop: 20,
          marginBottom: 20
        },
        title: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 24,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "center",
          margin: { top: 20, right: 0, bottom: 10, left: 0 }
        },
        subtitle: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#666666",
          fontStyle: "italic",
          alignment: "center",
          margin: { top: 5, right: 0, bottom: 0, left: 0 }
        }
      },
      allergens: {
        title: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 22,
          fontColor: "#000000",
          fontStyle: "bold",
          alignment: "center",
          margin: { top: 0, right: 0, bottom: 15, left: 0 }
        },
        description: {
          visible: true,
          fontFamily: "Arial",
          fontSize: 14,
          fontColor: "#333333",
          fontStyle: "normal",
          alignment: "left",
          margin: { top: 0, right: 0, bottom: 15, left: 0 }
        },
        item: {
          number: {
            visible: true,
            fontFamily: "Arial",
            fontSize: 14,
            fontColor: "#000000",
            fontStyle: "bold",
            alignment: "left",
            margin: { top: 0, right: 8, bottom: 0, left: 0 }
          },
          title: {
            visible: true,
            fontFamily: "Arial",
            fontSize: 14,
            fontColor: "#333333",
            fontStyle: "normal",
            alignment: "left",
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
          },
          spacing: 10,
          backgroundColor: "#f9f9f9",
          borderRadius: 4,
          padding: 8
        }
      }
    };
    
    setLayouts(prev => [...prev, newLayout]);
    return newLayout;
  }, []);

  return {
    layouts,
    activeLayout,
    isLoading,
    error,
    changeActiveLayout,
    createLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout,
    cloneLayout,
    createNewLayout
  };
}
