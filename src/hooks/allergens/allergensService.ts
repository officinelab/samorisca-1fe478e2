
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";
import { toast } from "@/components/ui/sonner";
import { AllergenFormData } from "../useAllergensManager";

// Fetch all allergens from the database
export const fetchAllergens = async (): Promise<Allergen[]> => {
  try {
    const { data, error } = await supabase
      .from('allergens')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Errore nel recupero degli allergeni:', error);
    toast.error("Non è stato possibile caricare gli allergeni. Riprova più tardi.");
    return [];
  }
};

// Add a new allergen to the database
export const addAllergen = async (allergenData: Partial<Allergen>, allergens: Allergen[]): Promise<Allergen | null> => {
  try {
    // Find the next number and order values
    const maxNumber = Math.max(...allergens.map(a => a.number), 0);
    const nextNumber = maxNumber + 1;
    const maxOrder = Math.max(...allergens.map(a => a.display_order), 0);
    const nextOrder = maxOrder + 1;
    
    // Ensure title is provided (required by the database)
    if (!allergenData.title) {
      toast.error("Il titolo è obbligatorio");
      return null;
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
      toast.success("Allergene aggiunto con successo!");
      return data[0];
    }
    return null;
  } catch (error) {
    console.error('Errore nell\'aggiunta dell\'allergene:', error);
    toast.error("Errore nell'aggiunta dell'allergene. Riprova più tardi.");
    return null;
  }
};

// Update an existing allergen
export const updateAllergen = async (allergenId: string, allergenData: Partial<Allergen>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('allergens')
      .update(allergenData)
      .eq('id', allergenId);
    
    if (error) throw error;
    
    toast.success("Allergene aggiornato con successo!");
    return true;
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'allergene:', error);
    toast.error("Errore nell'aggiornamento dell'allergene. Riprova più tardi.");
    return false;
  }
};

// Delete an allergen from the database
export const deleteAllergen = async (allergenId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('allergens')
      .delete()
      .eq('id', allergenId);
    
    if (error) throw error;
    
    toast.success("Allergene eliminato con successo!");
    return true;
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'allergene:', error);
    toast.error("Errore nell'eliminazione dell'allergene. Riprova più tardi.");
    return false;
  }
};

// Update the order of multiple allergens after reordering
export const updateAllergensOrder = async (updatedAllergens: Allergen[]): Promise<boolean> => {
  try {
    // Update the database with new orders
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
    
    toast.success("Allergeni riordinati con successo!");
    return true;
  } catch (error) {
    console.error('Errore nel riordinamento degli allergeni:', error);
    toast.error("Errore nel riordinamento degli allergeni. Riprova più tardi.");
    return false;
  }
};
