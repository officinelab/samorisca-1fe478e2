import React, { useState } from 'react';
import { ProductForm } from "@/components/product/ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { dashboardStyles } from "./Dashboard.styles";
import { CategoriesList } from "./dashboard/CategoriesList";
import { ProductsList } from "./dashboard/ProductsList";
import { ProductDetail } from "./dashboard/ProductDetail";
import { useDashboardOperations } from "./dashboard/useDashboardOperations";
import { useMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useMobile();
  const [mobileView, setMobileView] = useState<'categories' | 'products' | 'detail'>('categories');
  
  // Dialog states
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [showDeleteProductDialog, setShowDeleteProductDialog] = useState(false);
  
  // Form states
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', active: true });

  const {
    selectedCategoryId,
    selectedProductId,
    setSelectedCategoryId,
    setSelectedProductId,
    categories,
    products,
    loadingCategories,
    loadingProducts,
    reorderCategory,
    reorderProduct,
    updateCategory,
    deleteCategory,
    updateProduct,
    deleteProduct
  } = useDashboardOperations();

  // Get current category name
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedCategoryName = selectedCategory?.name || '';

  // Get current product
  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Category handlers
  const handleAddCategory = () => {
    setCategoryForm({ name: '', active: true });
    setEditingCategory(null);
    setShowCategoryDialog(true);
  };

  const handleEditCategory = (category: any) => {
    setCategoryForm({ name: category.name, active: category.active });
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setShowDeleteCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, updates: categoryForm });
    } else {
      // Add new category logic would go here
    }
    setShowCategoryDialog(false);
  };

  const confirmDeleteCategory = () => {
    if (deletingCategoryId) {
      deleteCategory(deletingCategoryId);
      setShowDeleteCategoryDialog(false);
      setDeletingCategoryId(null);
    }
  };

  // Product handlers
  const handleAddProduct = () => {
    if (!selectedCategoryId) return;
    setEditingProduct(null);
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setDeletingProductId(productId);
    setShowDeleteProductDialog(true);
  };

  const confirmDeleteProduct = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setShowDeleteProductDialog(false);
      setDeletingProductId(null);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedProductId(null);
    if (isMobile) {
      setMobileView('products');
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    if (isMobile) {
      setMobileView('detail');
    }
  };

  // Mobile navigation
  const handleMobileBack = () => {
    if (mobileView === 'detail') {
      setMobileView('products');
    } else if (mobileView === 'products') {
      setMobileView('categories');
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className={dashboardStyles.container}>
        {mobileView === 'categories' && (
          <CategoriesList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onReorderCategory={reorderCategory}
            onAddCategory={handleAddCategory}
            loadingCategories={loadingCategories}
          />
        )}

        {mobileView === 'products' && (
          <div className="h-full">
            <div className="flex items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMobileBack}
                className={dashboardStyles.mobileBackButton}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                Prodotti - {selectedCategoryName}
              </h2>
            </div>
            <ProductsList
              products={products}
              selectedProductId={selectedProductId}
              selectedCategoryName={selectedCategoryName}
              onProductSelect={handleProductSelect}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onReorderProduct={reorderProduct}
              onAddProduct={handleAddProduct}
              loadingProducts={loadingProducts}
            />
          </div>
        )}

        {mobileView === 'detail' && (
          <div className="h-full">
            <div className="flex items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMobileBack}
                className={dashboardStyles.mobileBackButton}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">Dettagli Prodotto</h2>
            </div>
            <ProductDetail
              product={selectedProduct || null}
              categoryName={selectedCategoryName}
            />
          </div>
        )}

        {/* Product Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categoryId={selectedCategoryId}
              onSave={() => setShowProductDialog(false)}
              onCancel={() => setShowProductDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className={dashboardStyles.formContainer}>
              <div>
                <Label htmlFor="category-name">Nome Categoria</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Inserisci il nome della categoria"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="category-active"
                  checked={categoryForm.active}
                  onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, active: checked })}
                />
                <Label htmlFor="category-active">Categoria attiva</Label>
              </div>
            </div>
            <div className={dashboardStyles.formActions}>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Annulla
              </Button>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? 'Aggiorna' : 'Crea'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <AlertDialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Elimina Categoria</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler eliminare questa categoria? Tutti i prodotti associati verranno eliminati. Questa azione non può essere annullata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCategory}>
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Product Dialog */}
        <AlertDialog open={showDeleteProductDialog} onOpenChange={setShowDeleteProductDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Elimina Prodotto</AlertDialogTitle>
              <AlertDialogDescription>
                Sei sicuro di voler eliminare questo prodotto? Questa azione non può essere annullata.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteProduct}>
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={dashboardStyles.container}>
      <div className={dashboardStyles.desktopGrid}>
        <CategoriesList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onReorderCategory={reorderCategory}
          onAddCategory={handleAddCategory}
          loadingCategories={loadingCategories}
        />

        <ProductsList
          products={products}
          selectedProductId={selectedProductId}
          selectedCategoryName={selectedCategoryName}
          onProductSelect={handleProductSelect}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onReorderProduct={reorderProduct}
          onAddProduct={handleAddProduct}
          loadingProducts={loadingProducts}
        />

        <ProductDetail
          product={selectedProduct || null}
          categoryName={selectedCategoryName}
        />
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            categoryId={selectedCategoryId}
            onSave={() => setShowProductDialog(false)}
            onCancel={() => setShowProductDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
            </DialogTitle>
          </DialogHeader>
          <div className={dashboardStyles.formContainer}>
            <div>
              <Label htmlFor="category-name">Nome Categoria</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Inserisci il nome della categoria"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="category-active"
                checked={categoryForm.active}
                onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, active: checked })}
              />
              <Label htmlFor="category-active">Categoria attiva</Label>
            </div>
          </div>
          <div className={dashboardStyles.formActions}>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Annulla
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? 'Aggiorna' : 'Crea'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa categoria? Tutti i prodotti associati verranno eliminati. Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Product Dialog */}
      <AlertDialog open={showDeleteProductDialog} onOpenChange={setShowDeleteProductDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Prodotto</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo prodotto? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
