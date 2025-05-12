
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";
import { ProductForm } from "@/components/product/ProductForm";
import { useMenuData } from "@/hooks/useMenuData";

const Dashboard = () => {
  const {
    categories,
    products,
    selectedProduct,
    selectProduct,
    isLoading,
    error,
    fetchMenuData
  } = useMenuData();

  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const productFormRef = useRef<HTMLDivElement>(null);

  // Aggiorna i dati quando il componente viene montato
  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Scroll alla parte superiore quando viene selezionato un prodotto
  useEffect(() => {
    if (selectedProduct && productFormRef.current) {
      productFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedProduct]);

  // Funzione per filtrare i prodotti in base ai termini di ricerca
  const filteredProducts = products ? products.filter(product => {
    if (!searchTerm) return true;
    
    // Dividiamo i termini di ricerca per supportare più parole
    const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    
    // Verifichiamo se il prodotto contiene tutti i termini di ricerca
    return searchTerms.every(term => 
      product.title.toLowerCase().includes(term) || 
      (product.description && product.description.toLowerCase().includes(term))
    );
  }) : [];

  // Gestisce la pulizia della ricerca e mantiene il focus
  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  if (isLoading) {
    return <div>Caricamento in corso...</div>;
  }

  if (error) {
    return <div>Errore: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Form di modifica prodotto */}
      <div ref={productFormRef}>
        {selectedProduct && (
          <Card>
            <CardContent className="p-6">
              <ProductForm
                product={selectedProduct}
                onCancel={() => selectProduct(null)}
                key={selectedProduct.id}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filtro di ricerca */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Cerca prodotto..."
            className="pl-8 pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button 
          onClick={() => selectProduct(null)}
          variant="outline"
        >
          Nuovo Prodotto
        </Button>
      </div>

      {/* Elenco categorie e prodotti */}
      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <div className="space-y-2">
                {filteredProducts
                  .filter(product => product.category_id === category.id)
                  .map(product => (
                    <div 
                      key={product.id} 
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        selectProduct(product);
                      }}
                    >
                      <span>{product.title}</span>
                      <span className="text-sm text-gray-500">
                        {product.price_standard ? `€${product.price_standard}` : ''}
                      </span>
                    </div>
                  ))
                }
                {filteredProducts.filter(product => product.category_id === category.id).length === 0 && (
                  <p className="text-sm text-gray-500 italic p-2">Nessun prodotto in questa categoria</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
