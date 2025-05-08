import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ShoppingCart, X, Plus, Minus, Info, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Allergen, Category as CategoryType, Product as ProductType } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardImage } from "@/components/ui/card";

// Local interfaces for cart items
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  variantName?: string;
  quantity: number;
}

interface PublicMenuProps {
  isPreview?: boolean;
  previewLanguage?: string;
  deviceView?: 'mobile' | 'desktop';
}

const PublicMenu: React.FC<PublicMenuProps> = ({ 
  isPreview = false,
  previewLanguage = 'it',
  deviceView = 'mobile'
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<Record<string, ProductType[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(previewLanguage);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAllergensInfo, setShowAllergensInfo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Gestisce lo scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuRef.current) {
        const scrollTop = menuRef.current.scrollTop;
        setShowBackToTop(scrollTop > 300);
      }
    };

    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Carica i dati
  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carica categorie attive ordinate per display_order
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
          
          // Carica prodotti per ogni categoria
          const productsMap: Record<string, ProductType[]> = {};
          
          for (const category of categoriesData) {
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*')
              .eq('category_id', category.id)
              .eq('is_active', true)
              .order('display_order', { ascending: true });
              
            if (productsError) throw productsError;
            
            // Per ogni prodotto, carica gli allergeni associati
            const productsWithAllergens = await Promise.all(
              (productsData || []).map(async (product) => {
                const { data: productAllergens, error: allergensError } = await supabase
                  .from('product_allergens')
                  .select('allergen_id')
                  .eq('product_id', product.id);
                
                if (allergensError) throw allergensError;
                
                let productAllergensDetails: { id: string; number: number; title: string }[] = [];
                if (productAllergens && productAllergens.length > 0) {
                  const allergenIds = productAllergens.map(pa => pa.allergen_id);
                  const { data: allergensDetails, error: detailsError } = await supabase
                    .from('allergens')
                    .select('id, number, title')
                    .in('id', allergenIds)
                    .order('number', { ascending: true });
                  
                  if (detailsError) throw detailsError;
                  productAllergensDetails = allergensDetails || [];
                }
                
                return { ...product, allergens: productAllergensDetails } as ProductType;
              })
            );
            
            productsMap[category.id] = productsWithAllergens;
          }
          
          setProducts(productsMap);
        }
        
        // Carica tutti gli allergeni
        const { data: allergensData, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true });

        if (allergensError) throw allergensError;
        setAllergens(allergensData || []);
        
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento del menu. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isPreview, previewLanguage]);

  // Aggiunge un prodotto al carrello
  const addToCart = (product: ProductType, variantName?: string, variantPrice?: number) => {
    const price = variantPrice !== undefined ? variantPrice : product.price_standard;
    const itemId = `${product.id}${variantName ? `-${variantName}` : ''}`;
    
    // Controlla se l'articolo è già nel carrello
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      // Aggiorna la quantità se esiste già
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Aggiunge un nuovo articolo
      setCart([
        ...cart, 
        {
          id: itemId,
          productId: product.id,
          name: product.title, // Fix: Use title instead of name
          price: price || 0,
          variantName,
          quantity: 1
        }
      ]);
    }
    
    toast.success(`${product.title} aggiunto all'ordine`);
  };

  // Rimuove un prodotto dal carrello
  const removeFromCart = (itemId: string) => {
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      
      if (updatedCart[existingItemIndex].quantity > 1) {
        // Diminuisce la quantità
        updatedCart[existingItemIndex].quantity -= 1;
        setCart(updatedCart);
      } else {
        // Rimuove l'articolo
        updatedCart.splice(existingItemIndex, 1);
        setCart(updatedCart);
      }
    }
  };

  // Rimuove completamente un prodotto dal carrello
  const removeItemCompletely = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Calcola il totale del carrello
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Svuota il carrello
  const clearCart = () => {
    setCart([]);
    toast.success("Ordine annullato");
  };

  // Invia l'ordine
  const submitOrder = () => {
    // In una implementazione reale, qui si potrebbe salvare l'ordine nel database
    toast.success("Ordine pronto! Mostralo al cameriere.");
  };

  // Scorrimento alla categoria selezionata
  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scorre all'inizio del menu
  const scrollToTop = () => {
    if (menuRef.current) {
      menuRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Funzione per troncare il testo
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Componente per la card del prodotto in versione mobile
  const ProductCardMobile = ({ product }: { product: ProductType }) => {
    return (
      <Card 
        className="mb-4" 
        clickable 
        onClick={() => setSelectedProduct(product)}
      >
        <div className="p-4">
          <div className="flex">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-lg mb-1">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {truncateText(product.description, 110)}
              </p>
              
              {product.allergens && product.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.allergens.map(allergen => (
                    <Badge key={allergen.id} variant="outline" className="text-xs px-1 py-0">
                      {allergen.number}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="font-medium">{product.price_standard?.toFixed(2)} €</div>
            </div>
            
            <div className="relative">
              <CardImage 
                src={product.image_url} 
                alt={product.title} 
                mobileView
              />
              
              <Button 
                variant="default" 
                size="icon"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-green-500 hover:bg-green-600 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Componente per la card del prodotto in versione desktop
  const ProductCardDesktop = ({ product }: { product: ProductType }) => {
    const isMobileView = isMobile || deviceView === 'mobile';
    
    return (
      <Card horizontal className="overflow-hidden h-full" clickable onClick={() => setSelectedProduct(product)}>
        {product.image_url ? (
          <CardImage 
            src={product.image_url} 
            alt={product.title}
            className="w-1/6 h-auto"
            square={isMobileView}
          />
        ) : (
          <div className={`w-1/6 bg-gray-100 flex items-center justify-center ${isMobileView ? "aspect-square" : "min-h-[150px]"}`}>
            <span className="text-gray-400">Nessuna immagine</span>
          </div>
        )}
        
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-lg">
              {product.title}
            </h3>
            
            {!product.has_multiple_prices && (
              <span className="font-medium">{product.price_standard?.toFixed(2)} €</span>
            )}
          </div>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          )}
          
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.allergens.map(allergen => (
                <Badge key={allergen.id} variant="outline" className="text-xs px-1 py-0">
                  {allergen.number}
                </Badge>
              ))}
            </div>
          )}
          
          {product.has_multiple_prices ? (
            <div className="space-y-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                Standard: {product.price_standard?.toFixed(2)} €
                <Plus size={16} />
              </Button>
              
              {product.price_variant_1_name && product.price_variant_1_value && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, product.price_variant_1_name, product.price_variant_1_value);
                  }}
                >
                  {product.price_variant_1_name}: {product.price_variant_1_value?.toFixed(2)} €
                  <Plus size={16} />
                </Button>
              )}
              
              {product.price_variant_2_name && product.price_variant_2_value && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, product.price_variant_2_name, product.price_variant_2_value);
                  }}
                >
                  {product.price_variant_2_name}: {product.price_variant_2_value?.toFixed(2)} €
                  <Plus size={16} />
                </Button>
              )}
            </div>
          ) : (
            <Button 
              variant="outline" 
              size={isMobileView ? "icon" : "sm"} 
              className={`${!isMobileView ? "w-full justify-between" : ""} mt-2 ml-auto flex`}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              {!isMobileView && "Aggiungi"}
              <Plus size={16} />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-30">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold ml-2">Sa Morisca</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Lingua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[90%] sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Il tuo ordine</SheetTitle>
                  <SheetDescription>
                    Rivedi il tuo ordine prima di comunicarlo al cameriere.
                  </SheetDescription>
                </SheetHeader>
                
                {cart.length > 0 ? (
                  <div className="mt-6 flex flex-col h-[calc(100%-180px)]">
                    <div className="flex-1 overflow-y-auto pr-1">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between border-b pb-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">
                                  {item.name}
                                  {item.variantName && (
                                    <span className="text-sm text-gray-500 ml-1">
                                      ({item.variantName})
                                    </span>
                                  )}
                                </p>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeItemCompletely(item.id)}
                                  className="h-6 w-6"
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                              <div className="flex justify-between mt-1">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full p-0"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span>{item.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full p-0"
                                    onClick={() => addToCart({ 
                                      id: item.productId,
                                      title: item.name, // Fix: Use title instead of name
                                      price_standard: item.price,
                                      category_id: "", // Required field for Product type
                                      description: null,
                                      image_url: null,
                                      is_active: true,
                                      display_order: 0
                                    } as ProductType, item.variantName)}
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>
                                <p className="font-medium">
                                  {(item.price * item.quantity).toFixed(2)} €
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t pt-4 space-y-4">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Totale</span>
                        <span>{calculateTotal().toFixed(2)} €</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1" onClick={clearCart}>
                          Annulla
                        </Button>
                        <Button className="flex-1" onClick={submitOrder}>
                          Conferma
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center mt-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">Il tuo ordine è vuoto</p>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <div className={`grid ${deviceView === 'desktop' ? 'grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
          {/* Categorie (Sidebar su desktop) */}
          <div className={`${deviceView === 'desktop' ? '' : 'mb-4'}`}>
            <div className="sticky top-20">
              {deviceView === 'mobile' ? (
                <ScrollArea className="w-full">
                  <div className="flex space-x-2 pb-2 px-1">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="whitespace-nowrap"
                        onClick={() => scrollToCategory(category.id)}
                      >
                        {category.title}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="font-bold text-lg mb-3">Categorie</h2>
                  <div className="space-y-1">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => scrollToCategory(category.id)}
                      >
                        {category.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Menu principale */}
          <div className={deviceView === 'desktop' ? 'col-span-3' : ''}>
            <ScrollArea ref={menuRef} className="h-[calc(100vh-140px)]">
              <div className="space-y-10 pb-16">
                {categories.map((category) => (
                  <section key={category.id} id={`category-${category.id}`} className="scroll-mt-20">
                    <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {products[category.id]?.map((product) => (
                        (deviceView === 'mobile' || isMobile) ? (
                          <ProductCardMobile key={product.id} product={product} />
                        ) : (
                          <ProductCardDesktop key={product.id} product={product} />
                        )
                      ))}
                    </div>
                    {products[category.id]?.length === 0 && (
                      <p className="text-gray-500 text-center py-6">
                        Nessun prodotto disponibile in questa categoria.
                      </p>
                    )}
                  </section>
                ))}

                {isLoading && (
                  <div className="space-y-8">
                    <div>
                      <Skeleton className="h-8 w-48 mb-4" />
                      <div className="grid grid-cols-1 gap-4">
                        <Skeleton className="h-52 w-full" />
                        <Skeleton className="h-52 w-full" />
                        <Skeleton className="h-52 w-full" />
                        <Skeleton className="h-52 w-full" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-8 w-48 mb-4" />
                      <div className="grid grid-cols-1 gap-4">
                        <Skeleton className="h-52 w-full" />
                        <Skeleton className="h-52 w-full" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sezione allergeni */}
                <section className="pt-6 border-t">
                  <Button 
                    variant="ghost" 
                    className="flex items-center mb-2"
                    onClick={() => setShowAllergensInfo(!showAllergensInfo)}
                  >
                    <Info size={18} className="mr-2" />
                    {showAllergensInfo ? "Nascondi informazioni allergeni" : "Mostra informazioni allergeni"}
                  </Button>
                  
                  {showAllergensInfo && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold mb-2">Legenda Allergeni</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {allergens.map(allergen => (
                          <div key={allergen.id} className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {allergen.number}
                            </Badge>
                            <span className="text-sm">{allergen.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Bottone per tornare in cima */}
      {showBackToTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-md z-30"
          onClick={scrollToTop}
        >
          <ChevronUp size={24} />
        </Button>
      )}
      
      {/* Dialog per visualizzare i dettagli del prodotto */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {selectedProduct.image_url && (
                  <div className="w-full h-48 relative rounded-md overflow-hidden">
                    <img 
                      src={selectedProduct.image_url} 
                      alt={selectedProduct.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-1">Descrizione</h4>
                  <p className="text-gray-600">{selectedProduct.description || "Nessuna descrizione disponibile."}</p>
                </div>
                
                {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Allergeni</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.allergens.map(allergen => (
                        <Badge key={allergen.id} variant="outline">
                          {allergen.number} - {allergen.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-1">Prezzo</h4>
                  {selectedProduct.has_multiple_prices ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Standard</span>
                        <span className="font-medium">{selectedProduct.price_standard?.toFixed(2)} €</span>
                      </div>
                      
                      {selectedProduct.price_variant_1_name && selectedProduct.price_variant_1_value && (
                        <div className="flex justify-between">
                          <span>{selectedProduct.price_variant_1_name}</span>
                          <span className="font-medium">{selectedProduct.price_variant_1_value?.toFixed(2)} €</span>
                        </div>
                      )}
                      
                      {selectedProduct.price_variant_2_name && selectedProduct.price_variant_2_value && (
                        <div className="flex justify-between">
                          <span>{selectedProduct.price_variant_2_name}</span>
                          <span className="font-medium">{selectedProduct.price_variant_2_value?.toFixed(2)} €</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="font-medium">{selectedProduct.price_standard?.toFixed(2)} €</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}>
                  Aggiungi all'ordine <Plus className="ml-2" size={16} />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-4">
        <div className="container max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;
