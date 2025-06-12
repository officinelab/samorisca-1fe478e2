
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import CategoriesList from "@/components/admin/dashboard/CategoriesList";
import CategoryForm from "@/components/admin/dashboard/CategoryForm";
import DashboardDialogs from "@/components/admin/dashboard/DashboardDialogs";
import DashboardLoading from "@/components/admin/dashboard/DashboardLoading";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Category } from "@/types/database";

const CategoryManagement = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products } = useProducts();

  if (categoriesLoading) {
    return <DashboardLoading />;
  }

  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <CategoriesList
                  categories={categories || []}
                  products={products || []}
                  onEditCategory={setEditingCategory}
                  onDeleteCategory={(category) => {
                    setCategoryToDelete(category);
                    setShowDeleteDialog(true);
                  }}
                />
              </div>
              
              <div className="lg:w-96">
                <CategoryForm
                  editingCategory={editingCategory}
                  onEditingChange={setEditingCategory}
                />
              </div>
            </div>

            <DashboardDialogs
              showDeleteDialog={showDeleteDialog}
              setShowDeleteDialog={setShowDeleteDialog}
              categoryToDelete={categoryToDelete}
              setCategoryToDelete={setCategoryToDelete}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CategoryManagement;
