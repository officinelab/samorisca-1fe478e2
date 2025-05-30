
import React, { useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import ProductForm from "@/components/product/ProductForm";
import CategoryForm from "./CategoryForm";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";

interface DashboardDialogsProps {
  dashboard: ReturnType<typeof useDashboard>;
  isMobile: boolean;
}

const DashboardDialogs: React.FC<DashboardDialogsProps> = ({
  dashboard,
  isMobile
}) => {
  const {
    showAddCategory,
    editingCategory,
    showAddProduct,
    editingProduct,
    selectedCategoryId,
    handleCategoryFormSave,
    handleProductFormSave,
    handleProductFormCancel,
    handleCategoryFormCancel
  } = dashboard;

  const memoizedEditingProduct = React.useMemo(() => {
    if (!editingProduct) return undefined;
    const {
      allergens,
      features,
      ...cleanProduct
    } = editingProduct;
    return cleanProduct;
  }, [editingProduct?.id]);

  const memoizedCategoryFormSave = React.useCallback(handleCategoryFormSave, [handleCategoryFormSave]);
  const memoizedCategoryFormCancel = React.useCallback(handleCategoryFormCancel, [handleCategoryFormCancel]);
  
  const categoryDialogOpen = showAddCategory || !!editingCategory;
  const productDialogOpen = showAddProduct || !!editingProduct;

  if (isMobile) {
    return (
      <>
        {/* Category Form Dialog - Mobile optimized */}
        <Dialog open={categoryDialogOpen} onOpenChange={open => {
          if (!open) {
            memoizedCategoryFormCancel();
          }
        }}>
          <DialogContent className={`${dashboardStyles.mobileDialog} sm:max-w-md p-0`}>
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-left">
                {editingCategory ? "Modifica Categoria" : "Nuova Categoria"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 overflow-y-auto flex-1">
              <CategoryForm 
                category={editingCategory} 
                onSave={memoizedCategoryFormSave} 
                onCancel={memoizedCategoryFormCancel} 
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Product Form Dialog - Mobile optimized */}
        {productDialogOpen && (
          <Dialog open={productDialogOpen} onOpenChange={open => {
            if (!open) {
              handleProductFormCancel();
            }
          }}>
            <DialogContent className={`${dashboardStyles.mobileDialog} w-[95vw] max-w-none p-0 h-[95vh]`}>
              <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
                <DialogTitle className="text-left text-lg">
                  {editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 overflow-hidden">
                <ProductForm 
                  key={memoizedEditingProduct?.id || 'new'} 
                  product={memoizedEditingProduct} 
                  categoryId={selectedCategoryId || undefined} 
                  onSave={handleProductFormSave} 
                  onCancel={handleProductFormCancel} 
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <>
      {/* Category Form Sheet - Desktop */}
      <Sheet open={categoryDialogOpen} onOpenChange={open => {
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

      {/* Product Form Sheet - Desktop */}
      {productDialogOpen && (
        <Sheet open={productDialogOpen} onOpenChange={open => {
          if (!open) {
            handleProductFormCancel();
          }
        }}>
          <SheetContent className="sm:max-w-4xl flex flex-col p-0 h-full">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>{editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 min-h-0">
              <ProductForm 
                key={memoizedEditingProduct?.id || 'new'} 
                product={memoizedEditingProduct} 
                categoryId={selectedCategoryId || undefined} 
                onSave={handleProductFormSave} 
                onCancel={handleProductFormCancel} 
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default DashboardDialogs;
