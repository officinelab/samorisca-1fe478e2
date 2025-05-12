
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2, Loader2, ChevronUp, X } from "lucide-react";
import ProductForm from "@/components/product/ProductForm";
import { useAllergensManager } from "@/hooks/useAllergensManager";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const formRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const { allergens } = useAllergensManager();

  // Funzione per caricare i dati
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carica le categorie
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (categoriesError) {
        throw categoriesError;
      }
      
      setCategories(categoriesData || []);
      
      // Carica i prodotti
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:category_id (id, title),
          label:label_id (id, title, color, text_color)
        `)
        .order('display_order', { ascending: true });
      
      if (productsError) {
        throw productsError;
      }
      
      setProducts(productsData || []);
    } catch (error) {
      console.error("Errore nel caricamento dei dati:", error);
      toast.error("Errore nel caricamento dei dati");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carica i dati all'avvio
  useEffect(() => {
    loadData();
    
    // Configurare lo scroll event listener
    const handleScroll = () => {
      if (formRef.current && window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Funzione per eliminare un prodotto
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
          
        if (error) {
          throw error;
        }
        
        toast.success("Prodotto eliminato con successo");
        loadData();
        
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error("Errore nell'eliminazione del prodotto:", error);
        toast.error("Errore nell'eliminazione del prodotto");
      }
    }
  };
  
  // Funzione per modificare un prodotto
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    // Esegui lo scroll all'inizio della pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Metti il focus sul primo campo del form (quando è stato caricato)
    setTimeout(() => {
      if (formRef.current) {
        const firstInput = formRef.current.querySelector('input, textarea');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 500);
  };
  
  // Funzione per tornare all'inizio della pagina
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Filtrare i prodotti in base alla ricerca
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category && product.category.title.toLowerCase().includes(query))
    );
  });

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna Form */}
        <div className="lg:col-span-1" ref={formRef}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedProduct ? "Modifica Prodotto" : "Aggiungi Nuovo Prodotto"}
              </h2>
              <ProductForm
                product={selectedProduct}
                categories={categories}
                allergens={allergens}
                onSuccess={() => {
                  loadData();
                  if (selectedProduct) {
                    toast.success("Prodotto aggiornato con successo");
                  } else {
                    toast.success("Prodotto aggiunto con successo");
                  }
                  setSelectedProduct(null);
                }}
                onCancel={() => setSelectedProduct(null)}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Colonna Lista Prodotti */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Barra di Ricerca Migliorata */}
              <div className="relative mb-6">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Cerca prodotti per nome, descrizione o categoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  icon={<Search className="h-4 w-4" />}
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Lista Prodotti */}
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center p-12">
                  <p className="text-muted-foreground">
                    {searchQuery ? "Nessun prodotto trovato con la ricerca specificata" : "Nessun prodotto disponibile"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryProducts = filteredProducts.filter(
                      product => product.category_id === category.id
                    );
                    
                    if (categoryProducts.length === 0) return null;
                    
                    return (
                      <div key={category.id} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                        <div className="space-y-2">
                          {categoryProducts.map(product => (
                            <div 
                              key={product.id} 
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium">{product.title}</h4>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pulsante Torna in Alto */}
      {showBackToTop && (
        <Button
          className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Dashboard;
