
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product } from "@/types/database";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import useSiteIcon from "@/hooks/useSiteIcon";

const PublicMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const isMobile = useIsMobile();
  const { siteIcon } = useSiteIcon();

  // Carica le categorie
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        
        setCategories(data || []);
        
        if (data && data.length > 0) {
          setSelectedCategory(data[0].id);
          await loadProducts(data[0].id);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Carica i prodotti
  const loadProducts = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          allergens:product_allergens(
            allergen:allergens(*)
          )
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Trasformiamo la risposta per renderla compatibile con il nostro tipo Product
      const formattedProducts = data.map(product => {
        const allergens = product.allergens
          ? product.allergens.map(a => a.allergen)
          : [];
          
        return {
          ...product,
          allergens,
        };
      });
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error);
    }
  };

  // Gestisce la selezione di una categoria
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId);
    setShowCategories(false);
  };

  // Filtra i prodotti in base alla ricerca
  const filteredProducts = products.filter(
    product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {siteIcon && (
            <img
              src={siteIcon}
              alt="Logo"
              className="h-10 w-auto mr-4"
            />
          )}
          <h1 className="text-2xl font-bold">Menu</h1>
        </div>
        
        <div>
          <Input
            placeholder="Cerca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>
      
      {/* Categorie */}
      <div className="mb-6">
        {isMobile ? (
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span>
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.title
                  : "Seleziona categoria"}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            
            {showCategories && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 shadow-lg z-10">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.title}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Prodotti */}
      <div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "Nessun prodotto trovato per questa ricerca."
              : "Nessun prodotto disponibile in questa categoria."}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex">
                  {product.image_url && (
                    <div className="mr-4 w-24 h-24 flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">{product.title}</h3>
                      
                      <div className="text-right">
                        {product.has_multiple_prices ? (
                          <div className="space-y-1">
                            {product.price_variant_1_name && product.price_variant_1_value !== null && (
                              <div>
                                <span className="text-sm">{product.price_variant_1_name}: </span>
                                <span className="font-semibold">
                                  {product.price_variant_1_value} €
                                  {product.has_price_suffix && product.price_suffix && (
                                    <span className="text-sm text-gray-500 ml-1">{product.price_suffix}</span>
                                  )}
                                </span>
                              </div>
                            )}
                            {product.price_variant_2_name && product.price_variant_2_value !== null && (
                              <div>
                                <span className="text-sm">{product.price_variant_2_name}: </span>
                                <span className="font-semibold">
                                  {product.price_variant_2_value} €
                                  {product.has_price_suffix && product.price_suffix && (
                                    <span className="text-sm text-gray-500 ml-1">{product.price_suffix}</span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="font-semibold">
                            {product.price_standard} €
                            {product.has_price_suffix && product.price_suffix && (
                              <span className="text-sm text-gray-500 ml-1">{product.price_suffix}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {product.description && (
                      <p className="text-gray-600 mt-1">{product.description}</p>
                    )}
                    
                    {product.allergens && product.allergens.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {product.allergens.map((allergen) => (
                            <span
                              key={allergen.id}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                              title={allergen.title}
                            >
                              {allergen.number}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMenu;
