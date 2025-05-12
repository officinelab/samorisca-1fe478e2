
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Plus, 
  Loader2, 
  ChevronRight, 
  ChevronDown,
  Filter 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { fetchProductsByCategory, fetchCategories, fetchLabels } from "@/hooks/menu/menuDataFetchers";
import ProductForm from "@/components/product/ProductForm";
import { Product } from "@/types/database";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch categories first
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  // Fetch products for each category
  const { isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["all-products", categories],
    queryFn: async () => {
      if (!categories.length) return [];
      
      const productPromises = categories.map(category => 
        fetchProductsByCategory(category.id)
      );
      
      const productsArrays = await Promise.all(productPromises);
      const allFetchedProducts = productsArrays.flat();
      setAllProducts(allFetchedProducts);
      return allFetchedProducts;
    },
    enabled: categories.length > 0
  });

  const isLoading = categoriesLoading || productsLoading;
  const error = categoriesError || productsError;

  // Manteniamo il focus sull'input di ricerca
  useEffect(() => {
    // Manteniamo il focus solo se il campo aveva già il focus prima dell'aggiornamento
    if (document.activeElement === searchInputRef.current) {
      // Utilizziamo un timeout per assicurarci che il focus venga applicato dopo il rendering
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [searchTerm, allProducts]);

  if (error) {
    toast.error("Errore nel caricamento dei prodotti");
  }

  // Raggruppamento dei prodotti per categoria
  const groupedProducts = allProducts.reduce((acc: Record<string, Product[]>, product) => {
    const categoryName = product.label?.title || "Senza categoria";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {});

  // Filtraggio dei prodotti
  const filteredGroupedProducts = Object.entries(groupedProducts).reduce(
    (acc: Record<string, Product[]>, [category, products]) => {
      const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (filteredProducts.length > 0) {
        acc[category] = filteredProducts;
      }
      
      return acc;
    }, {}
  );

  const handleCategoryToggle = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleProductSave = () => {
    toast.success("Prodotto salvato con successo");
    setSelectedProduct(null);
    setIsAddProductOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestione Menu</h1>
        <Button onClick={() => setIsAddProductOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuovo Prodotto
        </Button>
      </div>

      <div className="mb-4 relative">
        <Input
          ref={searchInputRef}
          placeholder="Cerca prodotto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="flex flex-1 gap-4">
        {/* Colonna principale con la lista dei prodotti */}
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-220px)] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : Object.keys(filteredGroupedProducts).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nessun prodotto trovato
              </div>
            ) : (
              Object.entries(filteredGroupedProducts).map(([category, products]) => (
                <Collapsible
                  key={category}
                  open={openCategories[category] !== false}
                  className="mb-4"
                >
                  <CollapsibleTrigger asChild>
                    <div 
                      className="flex items-center justify-between p-2 bg-muted rounded-md cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <h3 className="font-medium">{category}</h3>
                      {openCategories[category] !== false ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1 space-y-1 pl-2">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className={`p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                            selectedProduct?.id === product.id ? "bg-muted" : ""
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="font-medium">{product.title}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                  <Separator className="my-2" />
                </Collapsible>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Colonna dei dettagli del prodotto */}
        <div className="w-1/2">
          {selectedProduct && (
            <div className="border rounded-lg p-4 h-[calc(100vh-220px)] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Modifica Prodotto</h2>
              <ProductForm
                product={selectedProduct}
                onSave={handleProductSave}
                onCancel={() => setSelectedProduct(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialog per aggiungere un nuovo prodotto */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Prodotto</DialogTitle>
          </DialogHeader>
          <ProductForm onSave={handleProductSave} onCancel={() => setIsAddProductOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
