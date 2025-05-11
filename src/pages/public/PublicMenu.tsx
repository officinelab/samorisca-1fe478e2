
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Allergen, Category as CategoryType, Product as ProductType } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Import new components
import { Header } from "@/components/public-menu/Header";
import { Footer } from "@/components/public-menu/Footer";
import { CategorySidebar } from "@/components/public-menu/CategorySidebar";
import { CategorySection, CategorySectionSkeleton } from "@/components/public-menu/CategorySection";
import { AllergensSection } from "@/components/public-menu/AllergensSection";
import { CartSheet } from "@/components/public-menu/CartSheet";
import { ProductDetailsDialog } from "@/components/public-menu/ProductDetailsDialog";
import { BackToTopButton } from "@/components/public-menu/BackToTopButton";
import { useCart } from "@/hooks/useCart";

// Local interfaces for PublicMenu props
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
  const [showAllergensInfo, setShowAllergensInfo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { siteSettings } = useSiteSettings();
  
  // Use the cart hook
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely,
    calculateTotal, 
    clearCart, 
    submitOrder,
    getCartItemsCount 
  } = useCart();
  
  // Handle scroll
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

  // Load data
  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load active categories ordered by display_order
        const {
          data: categoriesData,
          error: categoriesError
        } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order', {
          ascending: true
        });
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);

          // Load products for each category
          const productsMap: Record<string, ProductType[]> = {};
          for (const category of categoriesData) {
            const {
              data: productsData,
              error: productsError
            } = await supabase.from('products').select('*').eq('category_id', category.id).eq('is_active', true).order('display_order', {
              ascending: true
            });
            
            if (productsError) throw productsError;

            // For each product, load associated allergens
            const productsWithAllergens = await Promise.all((productsData || []).map(async product => {
              const {
                data: productAllergens,
                error: allergensError
              } = await supabase.from('product_allergens').select('allergen_id').eq('product_id', product.id);
              
              if (allergensError) throw allergensError;
              
              let productAllergensDetails: {
                id: string;
                number: number;
                title: string;
              }[] = [];
              
              if (productAllergens && productAllergens.length > 0) {
                const allergenIds = productAllergens.map(pa => pa.allergen_id);
                const {
                  data: allergensDetails,
                  error: detailsError
                } = await supabase.from('allergens').select('id, number, title').in('id', allergenIds).order('number', {
                  ascending: true
                });
                
                if (detailsError) throw detailsError;
                productAllergensDetails = allergensDetails || [];
              }
              
              return {
                ...product,
                allergens: productAllergensDetails
              } as ProductType;
            }));
            
            productsMap[category.id] = productsWithAllergens;
          }
          
          setProducts(productsMap);
        }

        // Load all allergens
        const {
          data: allergensData,
          error: allergensError
        } = await supabase.from('allergens').select('*').order('number', {
          ascending: true
        });
        
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

  // Scroll to selected category
  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top of menu
  const scrollToTop = () => {
    if (menuRef.current) {
      menuRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Function to truncate text
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <Header 
        language={language}
        setLanguage={setLanguage}
        cartItemsCount={getCartItemsCount()}
        openCart={() => setIsCartOpen(true)}
      />

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <div className={`grid ${deviceView === 'desktop' ? 'grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
          {/* Categories (Sidebar on desktop) */}
          <CategorySidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            deviceView={deviceView}
            onSelectCategory={scrollToCategory}
          />

          {/* Main menu */}
          <div className={deviceView === 'desktop' ? 'col-span-3' : ''}>
            <ScrollArea ref={menuRef} className="h-[calc(100vh-140px)]">
              <div className="space-y-10 pb-16">
                {categories.map(category => (
                  <CategorySection 
                    key={category.id}
                    category={category}
                    products={products[category.id] || []}
                    isLoading={isLoading}
                    onSelectProduct={setSelectedProduct}
                    addToCart={addToCart}
                    deviceView={deviceView}
                    truncateText={truncateText}
                  />
                ))}

                {isLoading && <CategorySectionSkeleton />}

                {/* Allergens section */}
                <AllergensSection 
                  allergens={allergens}
                  showAllergensInfo={showAllergensInfo}
                  toggleAllergensInfo={() => setShowAllergensInfo(!showAllergensInfo)}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <BackToTopButton show={showBackToTop} onClick={scrollToTop} />
      
      {/* Product details dialog */}
      <ProductDetailsDialog 
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        addToCart={addToCart}
      />
      
      {/* Cart sheet */}
      <CartSheet 
        cart={cart}
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onItemAdd={addToCart}
        onItemRemove={removeFromCart}
        onItemRemoveCompletely={removeItemCompletely}
        onClearCart={clearCart}
        onSubmitOrder={submitOrder}
        calculateTotal={calculateTotal}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicMenu;
