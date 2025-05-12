
// Importiamo i componenti necessari
import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import { Product } from "@/types/database";
import { Category } from "@/types/database";
import ProductForm from "@/components/product/ProductForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Edit, Plus } from "lucide-react";

// Il componente Dashboard principale
const Dashboard = () => {
  // Definiamo gli stati per la gestione dei prodotti e delle categorie
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Aggiungiamo un ref per mantenere il focus durante la ricerca
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Caricamento dei dati all'avvio
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica le categorie
        setIsLoadingCategories(true);
        const { data: categoriesData } = await fetch('/api/categories').then(res => res.json());
        setCategories(categoriesData || []);
        setIsLoadingCategories(false);
        
        // Carica i prodotti
        setIsLoadingProducts(true);
        const { data: productsData } = await fetch('/api/products').then(res => res.json());
        setProducts(productsData || []);
        setIsLoadingProducts(false);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
        toast.error("Errore nel caricamento dei dati");
        setIsLoadingCategories(false);
        setIsLoadingProducts(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Assicuriamoci che il ref sia impostato dopo il rendering
  useEffect(() => {
    // Se stiamo cercando e il campo di ricerca esiste, manteniamo il focus
    if (searchTerm && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm, products]);

  // Funzione per gestire la selezione di un prodotto
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleProductSave = () => {
    // After saving, clear the selected product and refresh the product list
    setSelectedProduct(null);
    // Rifetch products
    fetch('/api/products').then(res => res.json()).then(({ data }) => {
      setProducts(data || []);
    });
  };

  // Funzione per eliminare un prodotto
  const handleProductDelete = async (product: Product) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      return;
    }
    
    try {
      await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      // Aggiorna la lista dei prodotti dopo l'eliminazione
      setProducts(products.filter(p => p.id !== product.id));
      setSelectedProduct(null);
      toast.success("Prodotto eliminato con successo!");
    } catch (error: any) {
      toast.error(`Errore durante l'eliminazione del prodotto: ${error.message}`);
    }
  };

  // Filtra i prodotti in base al termine di ricerca
  const filteredProducts = products
    ? products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Gestione Menu</h1>
      
      {/* Barra di ricerca migliorata */}
      <div className="mb-6">
        <input
          type="text"
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca prodotto..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" ref={mainContentRef}>
        {/* Colonna delle categorie e prodotti */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold mb-4">Categorie</h2>
            {isLoadingCategories ? (
              <p>Caricamento categorie...</p>
            ) : (
              <ul>
                {categories && categories.map((category) => (
                  <li key={category.id} className="mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <ul>
                      {filteredProducts.map((product) => {
                        if (product.category_id === category.id) {
                          return (
                            <li key={product.id} className="flex items-center justify-between py-2 border-b">
                              <span>{product.title}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProductSelect(product)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modifica
                              </Button>
                            </li>
                          );
                        }
                        return null;
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Form di modifica prodotto */}
        <div className="md:col-span-2">
          {selectedProduct ? (
            <div className="bg-white p-4 rounded-lg shadow">
              <ProductForm
                product={selectedProduct}
                onSave={handleProductSave}
                onCancel={() => setSelectedProduct(null)}
                onDelete={() => handleProductDelete(selectedProduct)}
              />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center min-h-[300px]">
              <p className="text-gray-500">Seleziona un prodotto per modificarlo</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Back to top button */}
      <BackToTopButton scrollContainerRef={mainContentRef} />
    </div>
  );
};

export default Dashboard;
