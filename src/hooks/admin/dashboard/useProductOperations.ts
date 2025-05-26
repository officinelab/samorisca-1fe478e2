
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

export const useProductOperations = (
  products: Product[],
  selectedCategoryId: string | null,
  loadProducts: (categoryId: string) => Promise<void>,
  setSelectedProductId: (id: string | null) => void
) => {
  const [isReorderingProducts, setIsReorderingProducts] = useState(false);
  const [reorderingProductsList, setReorderingProductsList] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false); // Previeni salvataggi multipli

  const startReorderingProducts = useCallback(() => {
    setIsReorderingProducts(true);
    setReorderingProductsList([...products]);
  }, [products]);

  const cancelReorderingProducts = () => {
    setIsReorderingProducts(false);
    setReorderingProductsList([]);
  };

  // Muovi il prodotto e salva l'ordine SUBITO dopo lo spostamento
  const moveProductInList = async (productId: string, direction: 'up' | 'down') => {
    if (isSaving) return; // Previeni salvataggi in contemporanea

    const currentIndex = reorderingProductsList.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= reorderingProductsList.length) return;

    const updatedList = [...reorderingProductsList];
    [updatedList[currentIndex], updatedList[newIndex]] = [updatedList[newIndex], updatedList[currentIndex]];

    setReorderingProductsList(updatedList);

    // Salva l'ordine immediatamente DOPO il setState
    // Per usare il valore aggiornato, aspetta il prossimo tick con setTimeout 0
    setIsSaving(true);
    setTimeout(async () => {
      await saveReorderProducts(updatedList);
      setIsSaving(false);
    }, 0);
  };

  // Salva l'ordine dati come argomento, oppure usa lo stato attuale
  const saveReorderProducts = async (customList?: Product[]) => {
    try {
      const updates = (customList || reorderingProductsList).map((product, index) => ({
        id: product.id,
        display_order: index + 1,
        title: product.title,
        category_id: product.category_id,
        description: product.description,
        image_url: product.image_url,
        is_active: product.is_active,
        price_standard: product.price_standard,
        has_multiple_prices: product.has_multiple_prices,
        price_variant_1_name: product.price_variant_1_name,
        price_variant_1_value: product.price_variant_1_value,
        price_variant_2_name: product.price_variant_2_name,
        price_variant_2_value: product.price_variant_2_value,
        has_price_suffix: product.has_price_suffix,
        price_suffix: product.price_suffix,
        label_id: product.label_id
      }));

      const { error } = await supabase
        .from('products')
        .upsert(updates);

      if (error) throw error;

      if (selectedCategoryId) {
        await loadProducts(selectedCategoryId);
      }

      setIsReorderingProducts(false);
      setReorderingProductsList([]);
      toast.success("Ordine dei prodotti aggiornato con successo!");
    } catch (error) {
      console.error('Error reordering products:', error);
      toast.error("Errore nel riordinamento dei prodotti. Riprova più tardi.");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      if (selectedCategoryId) {
        await loadProducts(selectedCategoryId);
      }

      setSelectedProductId(null);
      toast.success("Prodotto eliminato con successo!");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Errore nell'eliminazione del prodotto. Riprova più tardi.");
    }
  };

  return {
    isReorderingProducts,
    reorderingProductsList,
    startReorderingProducts,
    cancelReorderingProducts,
    moveProductInList,
    saveReorderProducts,
    deleteProduct
  };
};
