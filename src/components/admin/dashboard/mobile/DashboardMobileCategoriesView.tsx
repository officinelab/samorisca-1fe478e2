
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Category } from "@/types/database";
import CategoriesList from "../CategoriesList";
import DashboardMobileHeader from "./DashboardMobileHeader";

interface DashboardMobileCategoriesViewProps {
  categories: Category[];
  selectedCategoryId: string | null;
  isReorderingCategories: boolean;
  reorderingCategoriesList: Category[];
  currentPageTitle: string;
  onCategorySelect: (categoryId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveCategory: (fromIndex: number, toIndex: number) => void;
  onSaveReorder: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddCategory: () => void;
}

const DashboardMobileCategoriesView: React.FC<DashboardMobileCategoriesViewProps> = ({
  categories,
  selectedCategoryId,
  isReorderingCategories,
  reorderingCategoriesList,
  currentPageTitle,
  onCategorySelect,
  onStartReordering,
  onCancelReordering,
  onMoveCategory,
  onSaveReorder,
  onEditCategory,
  onDeleteCategory,
  onAddCategory
}) => {
  return (
    <div className={dashboardStyles.mobileContainer}>
      <DashboardMobileHeader
        currentView="categories"
        currentPageTitle={currentPageTitle}
        breadcrumbItems={[]}
        showBackButton={false}
      />
      <div className={dashboardStyles.mobileContent}>
        <div className={dashboardStyles.categoriesContent}>
          <CategoriesList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            isReorderingCategories={isReorderingCategories}
            reorderingCategoriesList={reorderingCategoriesList}
            onCategorySelect={onCategorySelect}
            onStartReordering={onStartReordering}
            onCancelReordering={onCancelReordering}
            onMoveCategory={onMoveCategory}
            onSaveReorder={onSaveReorder}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onAddCategory={onAddCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileCategoriesView;
