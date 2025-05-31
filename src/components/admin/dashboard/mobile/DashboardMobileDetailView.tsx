
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category, Product } from "@/types/database";
import ProductDetail from "../ProductDetail";
import DashboardMobileHeader from "./DashboardMobileHeader";

interface BreadcrumbItem {
  label: string;
  action?: () => void;
}

interface DashboardMobileDetailViewProps {
  selectedProduct: Product | null;
  selectedCategory: Category | null;
  breadcrumbItems: BreadcrumbItem[];
  onBack: () => void;
  onEditProduct: () => void;
}

const DashboardMobileDetailView: React.FC<DashboardMobileDetailViewProps> = ({
  selectedProduct,
  selectedCategory,
  breadcrumbItems,
  onBack,
  onEditProduct
}) => {
  return (
    <div className={dashboardStyles.mobileContainer}>
      <DashboardMobileHeader
        currentView="detail"
        currentPageTitle=""
        breadcrumbItems={breadcrumbItems}
        onBack={onBack}
        showBackButton={true}
      />
      <div className={dashboardStyles.mobileContent}>
        <div className="p-4">
          <ProductDetail
            product={selectedProduct}
            selectedCategory={selectedCategory}
            onEditProduct={onEditProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileDetailView;
