
import { useAddProduct } from "./useAddProduct";
import { useUpdateProduct } from "./useUpdateProduct";
import { useDeleteProduct } from "./useDeleteProduct";
import { Product } from "@/types/database";

export const useProductCRUD = (
  categoryId: string | null, 
  loadProducts: (categoryId: string) => Promise<Product[] | void>, 
  selectProduct: (productId: string) => void
) => {
  const { addProduct } = useAddProduct(categoryId, loadProducts, selectProduct);
  const { updateProduct } = useUpdateProduct(categoryId, loadProducts, selectProduct);
  const { deleteProduct } = useDeleteProduct(categoryId, loadProducts);

  return {
    addProduct,
    updateProduct,
    deleteProduct
  };
};
