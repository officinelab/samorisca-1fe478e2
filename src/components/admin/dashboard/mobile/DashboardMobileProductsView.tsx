
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category, Product } from "@/types/database";
import ProductsList from "../ProductsList";
import DashboardMobileHeader from "./DashboardMobileHeader";

interface BreadcrumbItem {
  label: string;
  action?: () => void;
}

interface DashboardMobileProductsViewProps {
  products: Product[];
  selectedProductId: string | null;
  selectedCategory: Category | null;
  isReorderingProducts: boolean;
  reorderingProductsList: Product[];
  breadcrumbItems: BreadcrumbItem[];
  onProductSelect: (productId: string) => void;
  onBack: () => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveProduct: (fromIndex: number, toIndex: number) => void;
  onSaveReorder: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
}

const DashboardMobileProductsView: React.FC<DashboardMobileProductsViewProps> = ({
  products,
  selectedProductId,
  selectedCategory,
  isReorderingProducts,
  reorderingProductsList,
  breadcrumbItems,
  onProductSelect,
  onBack,
  onStartReordering,
  onCancelReordering,
  onMoveProduct,
  onSaveReorder,
  onEditProduct,
  onDeleteProduct,
  onAddProduct
}) => {
  return (
    <div className={dashboardStyles.mobileContainer}>
      <DashboardMobileHeader
        currentView="products"
        currentPageTitle=""
        breadcrumbItems={breadcrumbItems}
        onBack={onBack}
        showBackButton={true}
      />
      <div className={dashboardStyles.mobileContent}>
        <div className={dashboardStyles.productsContent}>
          <ProductsList
            products={products}
            selectedProductId={selectedProductId}
            selectedCategory={selectedCategory}
            isReorderingProducts={isReorderingProducts}
            reorderingProductsList={reorderingProductsList}
            onProductSelect={onProductSelect}
            onStartReordering={onStartReordering}
            onCancelReordering={onCancelReordering}
            onMoveProduct={onMoveProduct}
            onSaveReorder={onSaveReorder}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
            onAddProduct={onAddProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileProductsView;
