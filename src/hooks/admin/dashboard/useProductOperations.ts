
import { useState, useCallback, useEffect } from "react";
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

  // Aggiorna reorderingProductsList quando products viene aggiornato durante la modalità riordino
  useEffect(() => {
    if (isReorderingProducts && products.length > 0) {
      console.log('=== Updating reorderingProductsList with new products ===');
      setReorderingProductsList([...products]);
    }
  }, [products, isReorderingProducts]);

  // DEBUG added to startReorderingProducts
  const startReorderingProducts = useCallback(() => {
    console.log('=== startReorderingProducts ===');
    console.log('Current products:', products.length);
    setIsReorderingProducts(true);
    setReorderingProductsList([...products]);
    console.log('Set reordering list with:', products.length, 'products');
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
        display_order: index + 1, // Parte da 1 invece di 0
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
