
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Search, XCircle } from "lucide-react";
import { getProductById, getProducts } from "@/hooks/products/useProductFormSubmit";
import ProductForm from "@/components/product/ProductForm";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/database";

const Dashboard = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: selectedProduct } = useQuery({
    queryKey: ["product", selectedProductId],
    queryFn: () => (selectedProductId ? getProductById(selectedProductId) : null),
    enabled: !!selectedProductId,
  });

  // Funzione per filtrare i prodotti in base al termine di ricerca
  const filteredProducts = products.filter((product: Product) => {
    if (!searchTerm) return true;
    
    // Cerchiamo in titolo e descrizione, case insensitive
    const termLower = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(termLower) || 
      (product.description && product.description.toLowerCase().includes(termLower))
    );
  });

  // Funzione per cancellare il termine di ricerca
  const clearSearch = () => {
    setSearchTerm("");
    // Manteniamo il focus sull'input dopo la cancellazione
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Gestisce la selezione di un prodotto per la modifica
  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    
    // Scorriamo fino all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Dopo lo scroll, impostiamo il focus sul primo campo del form
    setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input, textarea') as HTMLElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 500);
  };

  // Gestisce la chiusura del form
  const handleCloseForm = () => {
    setSelectedProductId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold">Gestione Menu</h1>

        <div className="relative w-full sm:w-auto">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Cerca prodotti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
            icon={<Search size={18} />}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <XCircle size={18} className="text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Tabs defaultValue="products">
            <TabsList className="w-full">
              <TabsTrigger value="products" className="flex-1">
                Prodotti
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex-1">
                Categorie
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-4">
              <ScrollArea className="h-[70vh]">
                <div className="space-y-2">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: Product) => (
                      <div
                        key={product.id}
                        className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{product.title}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {product.description}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <Pencil size={18} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {searchTerm ? "Nessun prodotto trovato" : "Nessun prodotto disponibile"}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="categories" className="mt-4">
              <div className="text-center py-4 text-gray-500">
                Funzionalità di gestione categorie in sviluppo
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-3">
          <div ref={formRef}>
            {selectedProduct ? (
              <Card className="p-6">
                <ProductForm
                  product={selectedProduct}
                  onSave={handleCloseForm}
                  onCancel={handleCloseForm}
                />
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 border-2 border-dashed rounded-md">
                <p className="text-gray-500">
                  Seleziona un prodotto dalla lista per modificarlo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
