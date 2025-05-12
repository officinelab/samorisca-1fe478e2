
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, X, ArrowUp } from "lucide-react";
import CategoryTab from "@/components/dashboard/CategoryTab";
import ProductList from "@/components/dashboard/ProductList";
import { useMenuData } from "@/hooks/useMenuData";
import { Product } from "@/types/database";
import ProductForm from "@/components/product/ProductForm";

const Dashboard: React.FC = () => {
  const { 
    categories, 
    products, 
    isLoading, 
    error, 
    retryLoading,
    selectedCategories, 
    handleCategoryToggle, 
    handleToggleAllCategories 
  } = useMenuData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Funzione per filtrare i prodotti in base alla ricerca
  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const allProducts = Object.values(products).flat();
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

    const filtered = allProducts.filter(product => {
      // Controlla se ogni termine di ricerca è presente nel titolo o nella descrizione
      return searchTerms.every(term => 
        product.title?.toLowerCase().includes(term) || 
        product.description?.toLowerCase().includes(term)
      );
    });

    setFilteredProducts(filtered);
  };

  // Filtra i prodotti quando cambia la query di ricerca
  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  // Gestisce lo scroll all'inizio della pagina quando viene selezionato un prodotto
  useEffect(() => {
    if (selectedProduct && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedProduct]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rendering condizionale in base allo stato di caricamento o errore
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-96">
      <p>Caricamento dei dati in corso...</p>
    </div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-96">
      <p className="text-red-500">Si è verificato un errore: {error as string}</p>
      <Button onClick={retryLoading} className="mt-4">Riprova</Button>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Form di modifica prodotto */}
      {selectedProduct && (
        <div ref={formRef} className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Modifica Prodotto</h2>
          <ProductForm
            product={selectedProduct}
            onSave={handleCancelEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      {/* Barra di ricerca */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Cerca prodotti..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={handleClearSearch}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Risultati della ricerca */}
      {searchQuery && filteredProducts.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Risultati della ricerca</h2>
          <ProductList 
            products={filteredProducts} 
            onEditProduct={handleEditProduct} 
          />
        </div>
      )}

      {searchQuery && filteredProducts.length === 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-muted-foreground">Nessun prodotto trovato per "{searchQuery}"</p>
        </div>
      )}

      {/* Categorie e prodotti */}
      {!searchQuery && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Categorie</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleAllCategories}
              >
                {selectedCategories.length === categories.length ? 'Deseleziona Tutto' : 'Seleziona Tutto'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <CategoryTab 
                  key={category.id} 
                  category={category}
                  isActive={selectedCategories.includes(category.id)}
                  onToggle={handleCategoryToggle}
                />
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Prodotti per categorie selezionate */}
          <div className="space-y-8">
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              const categoryProducts = products[categoryId] || [];
              
              return (
                <div key={categoryId} className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">{category?.name}</h2>
                  {categoryProducts.length > 0 ? (
                    <ProductList 
                      products={categoryProducts} 
                      onEditProduct={handleEditProduct}
                    />
                  ) : (
                    <p className="text-muted-foreground">Nessun prodotto in questa categoria</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pulsante "Top" */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
        onClick={handleBackToTop}
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
