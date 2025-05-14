import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Search, 
  Eye,
  EyeOff,
  ChevronUp, 
  ChevronDown,
  Package,
  Menu,
  Settings,
  Save,
  ArrowLeft
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Category, Product, Allergen, ProductLabel, ProductFeature } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

// Import nuovi componenti presentazionali:
import CategoryCard from "@/components/dashboard/CategoryCard";
import ProductCard from "@/components/dashboard/ProductCard";
import EmptyState from "@/components/dashboard/EmptyState";
import LoaderSkeleton from "@/components/dashboard/LoaderSkeleton";
import ProductForm from "@/components/product/ProductForm";
import CategoryFormPanel from "@/components/dashboard/CategoryFormPanel";
import CategoriesList from "@/components/dashboard/CategoriesList";
import ProductsList from "@/components/dashboard/ProductsList";
import ProductDetail from "@/components/dashboard/ProductDetail";
import MobileDashboardLayout from "@/components/dashboard/MobileDashboardLayout";
import DesktopDashboardLayout from "@/components/dashboard/DesktopDashboardLayout";

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(true);
  const [showMobileProducts, setShowMobileProducts] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    loadCategories();
    loadAllergens();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setCategories(data || []);
      
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
        loadProducts(data[0].id);
      } else if (selectedCategory) {
        loadProducts(selectedCategory);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle categorie:', error);
      toast.error("Errore nel caricamento delle categorie. Riprova più tardi.");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadAllergens = async () => {
    try {
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('number', { ascending: true });

      if (error) throw error;
      setAllergens(data || []);
    } catch (error) {
      console.error('Errore nel caricamento degli allergeni:', error);
      toast.error("Errore nel caricamento degli allergeni. Riprova più tardi.");
    }
  };

  const loadProducts = async (categoryId: string) => {
    setIsLoadingProducts(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, label:label_id(*)')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (productsError) throw productsError;
      
      const productsWithDetails = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: productAllergens, error: allergensError } = await supabase
            .from('product_allergens')
            .select('allergen_id')
            .eq('product_id', product.id);
          
          if (allergensError) throw allergensError;
          
          let productAllergensDetails: Allergen[] = [];
          if (productAllergens && productAllergens.length > 0) {
            const allergenIds = productAllergens.map(pa => pa.allergen_id);
            const { data: allergensDetails, error: detailsError } = await supabase
              .from('allergens')
              .select('*')
              .in('id', allergenIds);
            
            if (detailsError) throw detailsError;
            productAllergensDetails = allergensDetails || [];
          }
          
          const { data: productFeatures, error: featuresError } = await supabase
            .from('product_to_features')
            .select('feature_id')
            .eq('product_id', product.id);
          
          if (featuresError) throw featuresError;
          
          let productFeaturesDetails: ProductFeature[] = [];
          if (productFeatures && productFeatures.length > 0) {
            const featureIds = productFeatures.map(pf => pf.feature_id);
            const { data: featuresDetails, error: detailsError } = await supabase
              .from('product_features')
              .select('*')
              .in('id', featureIds)
              .order('display_order', { ascending: true });
            
            if (detailsError) throw detailsError;
            productFeaturesDetails = featuresDetails || [];
          }
          
          return { 
            ...product, 
            allergens: productAllergensDetails,
            features: productFeaturesDetails
          } as Product;
        })
      );
      
      setProducts(productsWithDetails);
      setSelectedProduct(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error);
      toast.error("Errore nel caricamento dei prodotti. Riprova più tardi.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId);
    
    if (isMobile) {
      setShowMobileCategories(false);
      setShowMobileProducts(true);
      setShowMobileDetail(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setIsEditing(false);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
    }
  };

  const handleCategoryReorder = async (categoryId: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= categories.length) return;
    
    const updatedCategories = [...categories];
    
    const category1 = updatedCategories[currentIndex];
    const category2 = updatedCategories[newIndex];
    
    const tempOrder = category1.display_order;
    category1.display_order = category2.display_order;
    category2.display_order = tempOrder;
    
    [updatedCategories[currentIndex], updatedCategories[newIndex]] = 
      [updatedCategories[newIndex], updatedCategories[currentIndex]];
    
    setCategories(updatedCategories);
    
    try {
      const updates = [
        { 
          id: category1.id, 
          display_order: category1.display_order,
          title: category1.title,
          description: category1.description,
          image_url: category1.image_url,
          is_active: category1.is_active
        },
        { 
          id: category2.id, 
          display_order: category2.display_order,
          title: category2.title,
          description: category2.description,
          image_url: category2.image_url,
          is_active: category2.is_active
        }
      ];
      
      const { error } = await supabase
        .from('categories')
        .upsert(updates);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Errore nel riordinamento delle categorie:', error);
      toast.error("Errore nel riordinamento delle categorie. Riprova più tardi.");
      loadCategories();
    }
  };

  const handleProductReorder = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= products.length) return;
    
    const updatedProducts = [...products];
    
    const product1 = updatedProducts[currentIndex];
    const product2 = updatedProducts[newIndex];
    
    const tempOrder = product1.display_order;
    product1.display_order = product2.display_order;
    product2.display_order = tempOrder;
    
    [updatedProducts[currentIndex], updatedProducts[newIndex]] = 
      [updatedProducts[newIndex], updatedProducts[currentIndex]];
    
    setProducts(updatedProducts);
    
    try {
      const updates = [
        { 
          id: product1.id, 
          display_order: product1.display_order,
          title: product1.title,
          category_id: product1.category_id,
          description: product1.description,
          image_url: product1.image_url,
          is_active: product1.is_active,
          price_standard: product1.price_standard,
          has_multiple_prices: product1.has_multiple_prices,
          price_variant_1_name: product1.price_variant_1_name,
          price_variant_1_value: product1.price_variant_1_value,
          price_variant_2_name: product1.price_variant_2_name,
          price_variant_2_value: product1.price_variant_2_value,
          has_price_suffix: product1.has_price_suffix,
          price_suffix: product1.price_suffix
        },
        { 
          id: product2.id, 
          display_order: product2.display_order,
          title: product2.title,
          category_id: product2.category_id,
          description: product2.description,
          image_url: product2.image_url,
          is_active: product2.is_active,
          price_standard: product2.price_standard,
          has_multiple_prices: product2.has_multiple_prices,
          price_variant_1_name: product2.price_variant_1_name,
          price_variant_1_value: product2.price_variant_1_value,
          price_variant_2_name: product2.price_variant_2_name,
          price_variant_2_value: product2.price_variant_2_value,
          has_price_suffix: product2.has_price_suffix,
          price_suffix: product2.price_suffix
        }
      ];
      
      const { error } = await supabase
        .from('products')
        .upsert(updates);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Errore nel riordinamento dei prodotti:', error);
      toast.error("Errore nel riordinamento dei prodotti. Riprova più tardi.");
      if (selectedCategory) {
        loadProducts(selectedCategory);
      }
    }
  };

  const handleAddCategory = async (categoryData: Partial<Category>) => {
    try {
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      if (!categoryData.title) {
        toast.error("Il titolo è obbligatorio");
        return;
      }
      
      const categoryToInsert = {
        title: categoryData.title,
        description: categoryData.description || null,
        image_url: categoryData.image_url || null,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
        display_order: nextOrder
      };
      
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryToInsert])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        await loadCategories();
        if (!selectedCategory) {
          setSelectedCategory(data[0].id);
          loadProducts(data[0].id);
        }
        toast.success("Categoria aggiunta con successo!");
        setShowCategoryForm(false);
      } 
    } catch (error: any) {
      console.error('Errore nell\'aggiunta della categoria:', error);
      toast.error(`Errore nell'aggiunta della categoria: ${error.message || 'Riprova più tardi.'}`);
    }
  };

  const handleUpdateCategory = async (categoryId: string, categoryData: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', categoryId);
      
      if (error) throw error;
      
      await loadCategories();
      
      toast.success("Categoria aggiornata con successo!");
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Errore nell\'aggiornamento della categoria:', error);
      toast.error("Errore nell'aggiornamento della categoria. Riprova più tardi.");
    }
  };

  const handleCategoryDelete = async (categoryId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa categoria? Verranno eliminati anche tutti i prodotti associati.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      await loadCategories();
      
      toast.success("Categoria eliminata con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione della categoria:', error);
      toast.error("Errore nell'eliminazione della categoria. Riprova più tardi.");
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    if (!selectedCategory) {
      toast.error("Seleziona prima una categoria");
      return;
    }

    try {
      const maxOrder = Math.max(...products.map(p => p.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      if (!productData.title) {
        toast.error("Il titolo è obbligatorio");
        return;
      }
      
      const { features, allergens, ...productToInsert } = productData;
      
      if (productToInsert.label_id === "none") {
        productToInsert.label_id = null;
      }
      
      const productInsert = {
        title: productToInsert.title,
        description: productToInsert.description || null,
        image_url: productToInsert.image_url || null,
        category_id: selectedCategory,
        is_active: productToInsert.is_active !== undefined ? productToInsert.is_active : true,
        display_order: nextOrder,
        price_standard: productToInsert.price_standard || 0,
        has_multiple_prices: productToInsert.has_multiple_prices || false,
        price_variant_1_name: productToInsert.price_variant_1_name || null,
        price_variant_1_value: productToInsert.price_variant_1_value || null,
        price_variant_2_name: productToInsert.price_variant_2_name || null,
        price_variant_2_value: productToInsert.price_variant_2_value || null,
        has_price_suffix: productToInsert.has_price_suffix || false,
        price_suffix: productToInsert.price_suffix || null,
        label_id: productToInsert.label_id || null
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([productInsert])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const productAllergens = allergens || [];
        if (productAllergens.length > 0) {
          const allergenInserts = productAllergens.map(allergen => ({
            product_id: data[0].id,
            allergen_id: allergen.id,
          }));

          const { error: allergensError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (allergensError) throw allergensError;
        }
        
        const productFeatures = features || [];
        if (productFeatures.length > 0) {
          const featureInserts = productFeatures.map(feature => ({
            product_id: data[0].id,
            feature_id: feature.id,
          }));

          const { error: featuresError } = await supabase
            .from('product_to_features')
            .insert(featureInserts);
          
          if (featuresError) throw featuresError;
        }

        await loadProducts(selectedCategory);
        setSelectedProduct(data[0].id);
        toast.success("Prodotto aggiunto con successo!");
        
        if (isMobile) {
          setShowMobileProducts(false);
          setShowMobileDetail(true);
        }
      }
    } catch (error: any) {
      console.error('Errore nell\'aggiunta del prodotto:', error);
      toast.error(`Errore nell'aggiunta del prodotto: ${error.message || 'Riprova più tardi.'}`);
    }
  };

  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      const { allergens, features, ...productUpdateData } = productData;
      
      if (productUpdateData.label_id === "none") {
        productUpdateData.label_id = null;
      }
      
      const { error } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      if (allergens !== undefined) {
        const { error: deleteError } = await supabase
          .from('product_allergens')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        if (allergens.length > 0) {
          const allergenInserts = allergens.map(allergen => ({
            product_id: productId,
            allergen_id: allergen.id,
          }));

          const { error: insertError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      if (features !== undefined) {
        const { error: deleteError } = await supabase
          .from('product_to_features')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        if (features.length > 0) {
          const featureInserts = features.map(feature => ({
            product_id: productId,
            feature_id: feature.id,
          }));

          const { error: insertError } = await supabase
            .from('product_to_features')
            .insert(featureInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      if (selectedCategory) {
        await loadProducts(selectedCategory);
      }
      
      setSelectedProduct(productId);
      setIsEditing(false);
      
      toast.success("Prodotto aggiornato con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento del prodotto:', error);
      toast.error("Errore nell'aggiornamento del prodotto. Riprova più tardi.");
    }
  };

  const handleProductDelete = async (productId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      if (selectedCategory) {
        await loadProducts(selectedCategory);
      }
      
      setSelectedProduct(null);
      setIsEditing(false);
      
      toast.success("Prodotto eliminato con successo!");
      
      if (isMobile) {
        setShowMobileProducts(true);
        setShowMobileDetail(false);
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione del prodotto:', error);
      toast.error("Errore nell'eliminazione del prodotto. Riprova più tardi.");
    }
  };

  // 2. CALLBACKS & HELPERS MOVED HERE

  // 3. CREATE THE PRODUCT FORM HANDLER
  const ProductDetailFormComponent = isEditing ? (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => {
              setShowMobileProducts(true);
              setShowMobileDetail(false);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-semibold">
          {products.find((p) => p.id === selectedProduct)
            ? "Modifica Prodotto"
            : "Nuovo Prodotto"}
        </h2>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <ProductForm
            product={products.find((p) => p.id === selectedProduct)}
            onSave={async (result) => {
              if (result.success) {
                toast.success("Prodotto aggiornato con successo!");
                if (selectedCategory) {
                  await loadProducts(selectedCategory);
                  setSelectedProduct(result.productId || null);
                }
                setIsEditing(false);
              } else {
                toast.error(
                  `Errore nell'aggiornamento del prodotto. ${result.error?.message || "Riprova più tardi."}`
                );
              }
            }}
            onCancel={() => {
              setIsEditing(false);
              if (isMobile) {
                setShowMobileDetail(true);
              }
            }}
          />
        </div>
      </ScrollArea>
    </div>
  ) : null;

  // 4. LAYOUT STATE & ACTIONS OBJECTS FOR PASSING TO LAYOUT COMPONENTS
  const state = {
    showMobileCategories,
    showMobileProducts,
    showMobileDetail,
    categories,
    selectedCategory,
    isLoadingCategories,
    products,
    selectedProduct,
    isLoadingProducts,
    searchQuery,
    isMobile,
    isEditing,
    ProductDetailFormComponent,
    onCategoriesBack: () => {
      setShowMobileCategories(true);
      setShowMobileProducts(false);
    },
    onProductsBack: () => {
      setShowMobileProducts(true);
      setShowMobileDetail(false);
    }
  };
  const actions = {
    handleCategorySelect,
    handleCategoryReorder: (direction: "up" | "down", id?: string) =>
      handleCategoryReorder(id!, direction),
    handleCategoryNew: () => {
      setEditingCategory(null);
      setShowCategoryForm(true);
    },
    handleCategoryEdit: (category: Category) => {
      setEditingCategory(category);
      setShowCategoryForm(true);
    },
    handleCategoryDelete,
    handleProductSelect,
    handleProductReorder: (direction: "up" | "down", id?: string) =>
      handleProductReorder(id!, direction),
    handleProductEdit: (id: string) => {
      setSelectedProduct(id);
      setIsEditing(true);
      if (isMobile) {
        setShowMobileProducts(false);
        setShowMobileDetail(true);
      }
    },
    handleProductDelete,
    handleProductNew: () => {
      if (!selectedCategory) {
        toast.error("Seleziona prima una categoria");
        return;
      }
      setSelectedProduct(null);
      setIsEditing(true);
      if (isMobile) {
        setShowMobileProducts(false);
        setShowMobileDetail(true);
      }
    },
    setSearchQuery,
    setIsEditing,
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      {isMobile ? (
        <MobileDashboardLayout state={state} actions={actions} />
      ) : (
        <DesktopDashboardLayout state={state} actions={actions} />
      )}
      <CategoryFormPanel />
    </div>
  );
};

export default Dashboard;
