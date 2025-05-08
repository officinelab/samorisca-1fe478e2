
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

export interface AllergenFormData {
  number?: number;
  title: string;
  description: string | null;
  icon_url: string | null;
}

export const useAllergensManager = () => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAllergen, setEditingAllergen] = useState<Allergen | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderingList, setReorderingList] = useState<Allergen[]>([]);

  // Carica gli allergeni
  useEffect(() => {
    const fetchAllergens = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('allergens')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        setAllergens(data || []);
      } catch (error) {
        console.error('Errore nel recupero degli allergeni:', error);
        toast.error("Non è stato possibile caricare gli allergeni. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllergens();
  }, []);

  // Aggiunge un nuovo allergene
  const handleAddAllergen = async (allergenData: Partial<Allergen>) => {
    try {
      // Trova il numero massimo attuale e incrementa di 1
      const maxNumber = Math.max(...allergens.map(a => a.number), 0);
      const nextNumber = maxNumber + 1;
      
      // Determina il prossimo display_order
      const maxOrder = Math.max(...allergens.map(a => a.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      // Ensure title is provided (required by the database)
      if (!allergenData.title) {
        toast.error("Il titolo è obbligatorio");
        return;
      }
      
      const { data, error } = await supabase
        .from('allergens')
        .insert([{ 
          ...allergenData, 
          number: allergenData.number || nextNumber,
          display_order: nextOrder,
          title: allergenData.title
        }])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setAllergens([...allergens, data[0]]);
        toast.success("Allergene aggiunto con successo!");
      }
    } catch (error) {
      console.error('Errore nell\'aggiunta dell\'allergene:', error);
      toast.error("Errore nell'aggiunta dell'allergene. Riprova più tardi.");
    }
  };

  // Aggiorna un allergene esistente
  const handleUpdateAllergen = async (allergenId: string, allergenData: Partial<Allergen>) => {
    try {
      const { error } = await supabase
        .from('allergens')
        .update(allergenData)
        .eq('id', allergenId);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setAllergens(allergens.map(a => 
        a.id === allergenId ? { ...a, ...allergenData } : a
      ));
      
      toast.success("Allergene aggiornato con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'allergene:', error);
      toast.error("Errore nell'aggiornamento dell'allergene. Riprova più tardi.");
    }
  };

  // Elimina un allergene
  const handleDeleteAllergen = async (allergenId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo allergene? Verrà rimosso da tutti i prodotti associati.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('allergens')
        .delete()
        .eq('id', allergenId);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setAllergens(allergens.filter(a => a.id !== allergenId));
      toast.success("Allergene eliminato con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'allergene:', error);
      toast.error("Errore nell'eliminazione dell'allergene. Riprova più tardi.");
    }
  };

  // Riordina gli allergeni
  const handleReorderAllergens = async () => {
    try {
      // Aggiorna i numeri progressivi in base all'ordine attuale
      const updatedAllergens = reorderingList.map((allergen, index) => ({
        ...allergen,
        number: index + 1,
        display_order: index
      }));
      
      // Aggiorna nel database
      for (const allergen of updatedAllergens) {
        const { error } = await supabase
          .from('allergens')
          .update({ 
            number: allergen.number, 
            display_order: allergen.display_order 
          })
          .eq('id', allergen.id);
        
        if (error) throw error;
      }
      
      // Aggiorna lo stato locale
      setAllergens(updatedAllergens);
      setIsReordering(false);
      toast.success("Allergeni riordinati con successo!");
    } catch (error) {
      console.error('Errore nel riordinamento degli allergeni:', error);
      toast.error("Errore nel riordinamento degli allergeni. Riprova più tardi.");
    }
  };

  // Inizia il riordinamento
  const startReordering = () => {
    setIsReordering(true);
    setReorderingList([...allergens]);
  };

  // Annulla il riordinamento
  const cancelReordering = () => {
    setIsReordering(false);
  };

  // Sposta un allergene nella lista di riordinamento
  const moveAllergen = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === reorderingList.length - 1)
    ) {
      return;
    }

    const newList = [...reorderingList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setReorderingList(newList);
  };

  return {
    allergens,
    isLoading,
    showAddDialog,
    setShowAddDialog,
    editingAllergen,
    setEditingAllergen,
    isReordering,
    reorderingList,
    handleAddAllergen,
    handleUpdateAllergen,
    handleDeleteAllergen,
    handleReorderAllergens,
    startReordering,
    cancelReordering,
    moveAllergen
  };
};
