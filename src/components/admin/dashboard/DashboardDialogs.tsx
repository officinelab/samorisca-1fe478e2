
import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import ProductForm from "@/components/product/ProductForm";
import CategoryForm from "./CategoryForm";

interface DashboardDialogsProps {
  dashboard: ReturnType<typeof useDashboard>;
  isMobile: boolean;
}

const DashboardDialogs: React.FC<DashboardDialogsProps> = ({ dashboard, isMobile }) => {
  const {
    showAddCategory,
    editingCategory,
    showAddProduct,
    editingProduct,
    selectedCategoryId,
    handleCategoryFormSave,
    handleProductFormSave,
    handleProductFormCancel  // Only declare once here!
  } = dashboard;

  // Memoized callbacks
  const memoizedCategoryFormSave = React.useCallback(handleCategoryFormSave, [handleCategoryFormSave]);
  const memoizedCategoryFormCancel = React.useCallback(handleProductFormCancel, [handleProductFormCancel]);

  const categoryDialogOpen = showAddCategory || !!editingCategory;
  const productDialogOpen = showAddProduct || !!editingProduct;

  // Defensive checks
  const safeCategoryForm =
    categoryDialogOpen && typeof memoizedCategoryFormSave === "function" && typeof memoizedCategoryFormCancel === "function" ? (
      <CategoryForm
        category={editingCategory}
        onSave={memoizedCategoryFormSave}
        onCancel={memoizedCategoryFormCancel}
      />
    ) : (
      <div className="p-4 text-destructive">Errore di rendering CategoryForm.</div>
    );

  const safeProductForm =
    productDialogOpen && typeof handleProductFormSave === "function" && typeof handleProductFormCancel === "function" ? (
      <ProductForm
        product={editingProduct}
        categoryId={selectedCategoryId || undefined}
        onSave={handleProductFormSave}
        onCancel={handleProductFormCancel}
      />
    ) : (
      productDialogOpen ? <div className="p-4 text-destructive">Errore di rendering ProductForm.</div> : null
    );

  if (isMobile) {
    return (
      <>
        {/* Category Form Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
          if (!open) {
            memoizedCategoryFormCancel();
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Modifica Categoria" : "Nuova Categoria"}</DialogTitle>
            </DialogHeader>
            {safeCategoryForm}
          </DialogContent>
        </Dialog>

        {/* Product Form Dialog */}
        <Dialog open={productDialogOpen} onOpenChange={(open) => {
          if (!open) {
            handleProductFormCancel();
          }
        }}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
              {safeProductForm}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {/* Category Form Sheet */}
      <Sheet open={categoryDialogOpen} onOpenChange={(open) => {
        if (!open) {
          memoizedCategoryFormCancel();
        }
      }}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingCategory ? "Modifica Categoria" : "Nuova Categoria"}</SheetTitle>
          </SheetHeader>
          <div className="pt-4">
            {safeCategoryForm}
          </div>
        </SheetContent>
      </Sheet>

      {/* Product Form Sheet */}
      <Sheet open={productDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleProductFormCancel();
        }
      }}>
        <SheetContent className="sm:max-w-4xl overflow-hidden">
          <SheetHeader>
            <SheetTitle>{editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}</SheetTitle>
          </SheetHeader>
          <div className="pt-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {safeProductForm}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardDialogs;

