
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface ProductLabel {
  id: string;
  title: string;
  color?: string | null;
  text_color?: string | null;
  display_order: number;
}

export const useProductLabels = () => {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLabel, setCurrentLabel] = useState<Partial<ProductLabel>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchLabels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_labels")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setLabels(data || []);
    } catch (error) {
      console.error("Errore nel caricamento delle etichette:", error);
      toast.error("Impossibile caricare le etichette");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (label?: ProductLabel) => {
    if (label) {
      setCurrentLabel(label);
      setIsEditing(true);
    } else {
      setCurrentLabel({});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveLabel = async () => {
    if (!currentLabel.title) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    try {
      if (isEditing && currentLabel.id) {
        const { error } = await supabase
          .from("product_labels")
          .update({
            title: currentLabel.title,
            color: currentLabel.color,
            text_color: currentLabel.text_color,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentLabel.id);

        if (error) throw error;
        toast.success("Etichetta aggiornata con successo");
      } else {
        const maxOrder = labels.length > 0 
          ? Math.max(...labels.map(l => l.display_order)) + 1 
          : 0;
          
        const { error } = await supabase
          .from("product_labels")
          .insert({
            title: currentLabel.title,
            color: currentLabel.color,
            text_color: currentLabel.text_color,
            display_order: maxOrder
          });

        if (error) throw error;
        toast.success("Etichetta creata con successo");
      }

      setIsDialogOpen(false);
      fetchLabels();
    } catch (error) {
      console.error("Errore durante il salvataggio dell'etichetta:", error);
      toast.error("Impossibile salvare l'etichetta");
    }
  };

  const handleDeleteLabel = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa etichetta?")) return;
    
    try {
      const { error } = await supabase
        .from("product_labels")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Etichetta eliminata con successo");
      fetchLabels();
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'etichetta:", error);
      toast.error("Impossibile eliminare l'etichetta");
    }
  };

  const reorderLabels = async (draggedId: string, targetId: string) => {
    const draggedIndex = labels.findIndex(label => label.id === draggedId);
    const targetIndex = labels.findIndex(label => label.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newLabels = [...labels];
    const [draggedItem] = newLabels.splice(draggedIndex, 1);
    newLabels.splice(targetIndex, 0, draggedItem);
    
    // Aggiorna display_order
    const updatedLabels = newLabels.map((label, index) => ({
      ...label,
      display_order: index
    }));
    
    setLabels(updatedLabels);
    
    try {
      // Aggiorna tutti i display_order nel database
      const updates = updatedLabels.map(label => ({
        id: label.id,
        title: label.title,
        color: label.color,
        text_color: label.text_color,
        display_order: label.display_order,
        updated_at: new Date().toISOString()
      }));
      
      const { error } = await supabase.from("product_labels").upsert(updates);
      if (error) throw error;
    } catch (error) {
      console.error("Errore durante il riordinamento:", error);
      toast.error("Impossibile aggiornare l'ordine");
      fetchLabels(); // Ripristina l'ordine originale
    }
  };

  return {
    labels,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentLabel,
    setCurrentLabel,
    fetchLabels,
    handleOpenDialog,
    handleSaveLabel,
    handleDeleteLabel,
    reorderLabels
  };
};
