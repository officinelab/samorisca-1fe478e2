
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature } from "@/types/database";
import { toast } from "@/components/ui/sonner";

export const useProductFeatureManager = () => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Partial<ProductFeature>>({});

  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error("Errore nel caricamento delle caratteristiche:", error);
      toast.error("Impossibile caricare le caratteristiche");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleOpenDialog = (feature?: ProductFeature) => {
    if (feature) {
      setCurrentFeature(feature);
      setIsEditing(true);
    } else {
      setCurrentFeature({});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveFeature = async (featureData: Partial<ProductFeature>) => {
    if (!featureData.title) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    try {
      if (isEditing && featureData.id) {
        const { error } = await supabase
          .from("product_features")
          .update({
            title: featureData.title,
            icon_url: featureData.icon_url,
            updated_at: new Date().toISOString()
          })
          .eq("id", featureData.id);

        if (error) throw error;
        toast.success("Caratteristica aggiornata con successo");
      } else {
        const maxOrder = features.length > 0 
          ? Math.max(...features.map(f => f.display_order)) + 1 
          : 0;
          
        const { error } = await supabase
          .from("product_features")
          .insert({
            title: featureData.title,
            icon_url: featureData.icon_url,
            display_order: maxOrder
          });

        if (error) throw error;
        toast.success("Caratteristica creata con successo");
      }

      setIsDialogOpen(false);
      fetchFeatures();
    } catch (error) {
      console.error("Errore durante il salvataggio della caratteristica:", error);
      toast.error("Impossibile salvare la caratteristica");
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa caratteristica?")) return;
    
    try {
      const { error } = await supabase
        .from("product_features")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Caratteristica eliminata con successo");
      fetchFeatures();
    } catch (error) {
      console.error("Errore durante l'eliminazione della caratteristica:", error);
      toast.error("Impossibile eliminare la caratteristica");
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const reorderFeatures = async (draggedId: string, targetId: string) => {
    const draggedIndex = features.findIndex(feature => feature.id === draggedId);
    const targetIndex = features.findIndex(feature => feature.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newFeatures = [...features];
    const [draggedItem] = newFeatures.splice(draggedIndex, 1);
    newFeatures.splice(targetIndex, 0, draggedItem);
    
    // Aggiorna display_order
    const updatedFeatures = newFeatures.map((feature, index) => ({
      ...feature,
      display_order: index
    }));
    
    setFeatures(updatedFeatures);
    
    try {
      // Aggiorna tutti i display_order nel database
      const updates = updatedFeatures.map(feature => ({
        id: feature.id,
        title: feature.title,
        icon_url: feature.icon_url,
        display_order: feature.display_order,
        updated_at: new Date().toISOString()
      }));
      
      const { error } = await supabase.from("product_features").upsert(updates);
      if (error) throw error;
    } catch (error) {
      console.error("Errore durante il riordinamento:", error);
      toast.error("Impossibile aggiornare l'ordine");
      fetchFeatures(); // Ripristina l'ordine originale
    }
  };
  
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId !== targetId) {
      reorderFeatures(draggedId, targetId);
    }
  };

  return {
    features,
    isLoading,
    isDialogOpen,
    currentFeature,
    isEditing,
    fetchFeatures,
    handleOpenDialog,
    handleCloseDialog,
    handleSaveFeature,
    handleDeleteFeature,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};

export default useProductFeatureManager;
