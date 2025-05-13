
import { useState } from "react";
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/use-toast";
import { saveLayouts, loadLayouts } from "../layoutStorage";
import { createDefaultLayout } from "../utils/operations/createDefaultLayout";
import { generateUniqueId } from "../utils/operations/idGenerator";

export const useLayoutOperations = (
  layouts: PrintLayout[],
  setLayouts: React.Dispatch<React.SetStateAction<PrintLayout[]>>,
  activeLayout: PrintLayout | null,
  setActiveLayout: React.Dispatch<React.SetStateAction<PrintLayout | null>>,
) => {
  const [isLoading, setIsLoading] = useState(false);

  // Add a new layout
  const addLayout = async (newLayout: Omit<PrintLayout, "id">): Promise<PrintLayout> => {
    setIsLoading(true);
    try {
      const layoutWithId = {
        ...newLayout,
        id: generateUniqueId(),
      };

      const updatedLayouts = [...layouts, layoutWithId];
      await saveLayouts(updatedLayouts);
      setLayouts(updatedLayouts);
      
      toast({
        title: "Layout aggiunto",
        description: `Il layout "${layoutWithId.name}" è stato aggiunto con successo`,
      });
      
      return layoutWithId;
    } catch (error) {
      console.error("Errore nell'aggiunta del layout:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta del layout",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing layout
  const updateLayout = async (layoutId: string, updatedData: Partial<PrintLayout>): Promise<PrintLayout | null> => {
    setIsLoading(true);
    try {
      const updatedLayouts = layouts.map(layout => 
        layout.id === layoutId ? { ...layout, ...updatedData } : layout
      );
      
      await saveLayouts(updatedLayouts);
      setLayouts(updatedLayouts);
      
      // Update activeLayout if it's the one being updated
      if (activeLayout && activeLayout.id === layoutId) {
        const updatedActiveLayout = { ...activeLayout, ...updatedData };
        setActiveLayout(updatedActiveLayout);
        return updatedActiveLayout;
      }
      
      toast({
        title: "Layout aggiornato",
        description: `Il layout è stato aggiornato con successo`,
      });
      
      return updatedLayouts.find(layout => layout.id === layoutId) || null;
    } catch (error) {
      console.error("Errore nell'aggiornamento del layout:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del layout",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a layout
  const deleteLayout = async (layoutId: string): Promise<boolean> => {
    if (layouts.length <= 1) {
      toast({
        title: "Impossibile eliminare",
        description: "Deve essere presente almeno un layout",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
      
      // If we're deleting the active layout, set a new active layout
      if (activeLayout && activeLayout.id === layoutId) {
        const newActiveLayout = updatedLayouts[0];
        setActiveLayout(newActiveLayout);
        
        // If the deleted layout was default, make the new active layout default
        if (activeLayout.isDefault) {
          const updatedLayoutsWithDefault = updatedLayouts.map((layout, index) => 
            index === 0 ? { ...layout, isDefault: true } : { ...layout, isDefault: false }
          );
          await saveLayouts(updatedLayoutsWithDefault);
          setLayouts(updatedLayoutsWithDefault);
        } else {
          await saveLayouts(updatedLayouts);
          setLayouts(updatedLayouts);
        }
      } else {
        await saveLayouts(updatedLayouts);
        setLayouts(updatedLayouts);
      }
      
      toast({
        title: "Layout eliminato",
        description: `Il layout è stato eliminato con successo`,
      });
      
      return true;
    } catch (error) {
      console.error("Errore nell'eliminazione del layout:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del layout",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clone a layout
  const cloneLayout = async (layoutId: string): Promise<PrintLayout | null> => {
    setIsLoading(true);
    try {
      const layoutToClone = layouts.find(layout => layout.id === layoutId);
      if (!layoutToClone) {
        toast({
          title: "Errore",
          description: "Layout da clonare non trovato",
          variant: "destructive",
        });
        return null;
      }
      
      const clonedLayout = {
        ...layoutToClone,
        id: generateUniqueId(),
        name: `${layoutToClone.name} (copia)`,
        isDefault: false,
      };
      
      const updatedLayouts = [...layouts, clonedLayout];
      await saveLayouts(updatedLayouts);
      setLayouts(updatedLayouts);
      
      toast({
        title: "Layout clonato",
        description: `Il layout "${layoutToClone.name}" è stato clonato con successo`,
      });
      
      return clonedLayout;
    } catch (error) {
      console.error("Errore nella clonazione del layout:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la clonazione del layout",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Set a layout as default
  const setDefaultLayout = async (layoutId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const updatedLayouts = layouts.map(layout => ({
        ...layout,
        isDefault: layout.id === layoutId
      }));
      
      await saveLayouts(updatedLayouts);
      setLayouts(updatedLayouts);
      
      // Update active layout if it's being set as default
      if (activeLayout) {
        const updatedActiveLayout = updatedLayouts.find(layout => layout.id === activeLayout.id);
        if (updatedActiveLayout) {
          setActiveLayout(updatedActiveLayout);
        }
      }
      
      toast({
        title: "Layout predefinito",
        description: `Il layout è stato impostato come predefinito`,
      });
      
      return true;
    } catch (error) {
      console.error("Errore nell'impostazione del layout predefinito:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'impostazione del layout predefinito",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a default layout if none exists
  const ensureDefaultLayoutExists = async (): Promise<PrintLayout | null> => {
    if (layouts.length > 0) {
      return layouts.find(layout => layout.isDefault) || layouts[0];
    }

    // Create a default layout
    try {
      const defaultLayout = createDefaultLayout();
      const layoutWithId = {
        ...defaultLayout,
        id: generateUniqueId(),
      };
      
      await saveLayouts([layoutWithId]);
      setLayouts([layoutWithId]);
      return layoutWithId;
    } catch (error) {
      console.error("Errore nella creazione del layout predefinito:", error);
      return null;
    }
  };

  return {
    isLoading,
    addLayout,
    updateLayout,
    deleteLayout,
    cloneLayout,
    setDefaultLayout,
    ensureDefaultLayoutExists,
  };
};

export default useLayoutOperations;
