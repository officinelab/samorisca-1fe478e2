
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import ProductsList from "@/components/admin/dashboard/ProductsList";
import ProductDetail from "@/components/admin/dashboard/ProductDetail";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types/database";

const ProductManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products } = useProducts();
  const { categories } = useCategories();

  return (
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col xl:flex-row gap-6 h-full">
              <div className="xl:w-1/2">
                <ProductsList
                  products={products || []}
                  categories={categories || []}
                  selectedProduct={selectedProduct}
                  onSelectProduct={setSelectedProduct}
                />
              </div>
              
              <div className="xl:w-1/2">
                <ProductDetail
                  selectedProduct={selectedProduct}
                  onProductChange={setSelectedProduct}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProductManagement;
