
import { useDashboardData } from "./useDashboardData";
import { useCategoryOperations } from "./useCategoryOperations";
import { useProductOperations } from "./useProductOperations";

export const useDashboardOperations = () => {
  const dashboardData = useDashboardData();
  
  const categoryOperations = useCategoryOperations(
    dashboardData.categories,
    dashboardData.loadCategories
  );

  const productOperations = useProductOperations(
    dashboardData.products,
    dashboardData.selectedCategoryId,
    dashboardData.loadProducts,
    dashboardData.setSelectedProductId
  );

  return {
    // Data state
    ...dashboardData,
    
    // Category operations
    ...categoryOperations,
    
    // Product operations
    ...productOperations
  };
};
