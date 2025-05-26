
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
    handleProductFormCancel,
    handleProductFormSave,
    handleProductFormCancel
  } = dashboard;

  // Callback memorizzate per evitare riferimento nuovo ad ogni render
  const memoizedCategoryFormSave = useCallback(handleCategoryFormSave, [handleCategoryFormSave]);
  const memoizedCategoryFormCancel = useCallback(handleProductFormCancel, [handleProductFormCancel]);

  // Anche ProductForm eventualmente può essere trattato uguale.

  const categoryDialogOpen = showAddCategory || !!editingCategory;
  const productDialogOpen = showAddProduct || !!editingProduct;

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
            <CategoryForm
              category={editingCategory}
              onSave={memoizedCategoryFormSave}
              onCancel={memoizedCategoryFormCancel}
            />
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
              <ProductForm
                product={editingProduct}
                categoryId={selectedCategoryId || undefined}
                onSave={handleProductFormSave}
                onCancel={handleProductFormCancel}
              />
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
            <CategoryForm
              category={editingCategory}
              onSave={memoizedCategoryFormSave}
              onCancel={memoizedCategoryFormCancel}
            />
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
            <ProductForm
              product={editingProduct}
              categoryId={selectedCategoryId || undefined}
              onSave={handleProductFormSave}
              onCancel={handleProductFormCancel}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardDialogs;
