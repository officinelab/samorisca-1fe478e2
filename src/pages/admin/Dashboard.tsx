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

  const handleDeleteCategory = async (categoryId: string) => {
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

  const handleDeleteProduct = async (productId: string) => {
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

  const ImageUploader = ({ 
    currentImage, 
    onImageUploaded, 
    label = "Immagine"
  }: { 
    currentImage?: string | null, 
    onImageUploaded: (url: string) => void,
    label?: string 
  }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        toast.error("Per favore seleziona un'immagine valida");
        return;
      }
      
      setIsUploading(true);
      
      try {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        const filePath = `menu/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('menu-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
          .from('menu-images')
          .getPublicUrl(data.path);
        
        onImageUploaded(publicUrlData.publicUrl);
      } catch (error) {
        console.error('Errore nel caricamento dell\'immagine:', error);
        toast.error("Errore nel caricamento dell'immagine. Riprova più tardi.");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {previewUrl && (
          <div className="relative w-full h-36 mb-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex items-center">
          <Label 
            htmlFor="image-upload" 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-2 w-full text-center hover:bg-gray-50"
          >
            {isUploading ? "Caricamento in corso..." : "Carica immagine"}
          </Label>
          <Input 
            id="image-upload" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>
    );
  };

  const categoryFormSchema = z.object({
    title: z.string().min(1, "Il nome è obbligatorio"),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
    image_url: z.string().optional().nullable(),
  });

  const productFormSchema = z.object({
    title: z.string().min(1, "Il nome è obbligatorio"),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
    image_url: z.string().optional().nullable(),
    price_standard: z.coerce.number().min(0, "Il prezzo deve essere maggiore o uguale a 0"),
    has_multiple_prices: z.boolean().default(false),
    price_variant_1_name: z.string().optional().nullable(),
    price_variant_1_value: z.coerce.number().optional().nullable(),
    price_variant_2_name: z.string().optional().nullable(),
    price_variant_2_value: z.coerce.number().optional().nullable(),
    has_price_suffix: z.boolean().default(false),
    price_suffix: z.string().optional().nullable(),
    label_id: z.string().optional().nullable(),
  });

  const CategoryFormPanel = () => {
    const isEditing = Boolean(editingCategory);
    
    const form = useForm<z.infer<typeof categoryFormSchema>>({
      resolver: zodResolver(categoryFormSchema),
      defaultValues: {
        title: editingCategory?.title || "",
        description: editingCategory?.description || "",
        is_active: editingCategory?.is_active ?? true,
        image_url: editingCategory?.image_url || null,
      },
    });
    
    const onSubmit = (values: z.infer<typeof categoryFormSchema>) => {
      if (isEditing && editingCategory) {
        handleUpdateCategory(editingCategory.id, values);
      } else {
        handleAddCategory(values);
      }
    };

    return (
      <Sheet open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{isEditing ? "Modifica Categoria" : "Nuova Categoria"}</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Categoria</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome categoria" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Descrizione della categoria"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <ImageUploader
                      currentImage={field.value || null}
                      onImageUploaded={(url) => field.onChange(url)}
                      label="Immagine Categoria"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Attiva</FormLabel>
                      <FormDescription>
                        Mostra questa categoria nel menu
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                  }}
                >
                  Annulla
                </Button>
                <Button type="submit">Salva</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  };

  const ProductForm = ({ product, onSubmit }: { 
    product: Product | null, 
    onSubmit: (data: any) => void 
  }) => {
    const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(
      product?.allergens || []
    );
    
    const [selectedFeatures, setSelectedFeatures] = useState<ProductFeature[]>(
      product?.features || []
    );
    
    const [productLabels, setProductLabels] = useState<ProductLabel[]>([]);
    const [productFeatures, setProductFeatures] = useState<ProductFeature[]>([]);
    
    useEffect(() => {
      const loadLabelsAndFeatures = async () => {
        try {
          const { data: labelsData, error: labelsError } = await supabase
            .from('product_labels')
            .select('*')
            .order('display_order', { ascending: true });
            
          if (labelsError) throw labelsError;
          setProductLabels(labelsData || []);
          
          const { data: featuresData, error: featuresError } = await supabase
            .from('product_features')
            .select('*')
            .order('display_order', { ascending: true });
            
          if (featuresError) throw featuresError;
          setProductFeatures(featuresData || []);
        } catch (error) {
          console.error('Errore nel caricamento delle etichette e caratteristiche:', error);
          toast.error("Errore nel caricamento delle opzioni. Riprova più tardi.");
        }
      };
      
      loadLabelsAndFeatures();
    }, []);
    
    const form = useForm<z.infer<typeof productFormSchema>>({
      resolver: zodResolver(productFormSchema),
      defaultValues: {
        title: product?.title || "",
        description: product?.description || "",
        is_active: product?.is_active ?? true,
        image_url: product?.image_url || null,
        price_standard: product?.price_standard || 0,
        has_multiple_prices: product?.has_multiple_prices || false,
        price_variant_1_name: product?.price_variant_1_name || "",
        price_variant_1_value: product?.price_variant_1_value || null,
        price_variant_2_name: product?.price_variant_2_name || "",
        price_variant_2_value: product?.price_variant_2_value || null,
        has_price_suffix: product?.has_price_suffix || false,
        price_suffix: product?.price_suffix || "",
        label_id: product?.label_id || null,
      },
    });
    
    const hasMultiplePrices = form.watch("has_multiple_prices");
    const hasPriceSuffix = form.watch("has_price_suffix");
    
    const toggleAllergen = (allergen: Allergen) => {
      if (selectedAllergens.some(a => a.id === allergen.id)) {
        setSelectedAllergens(selectedAllergens.filter(a => a.id !== allergen.id));
      } else {
        setSelectedAllergens([...selectedAllergens, allergen]);
      }
    };
    
    const toggleFeature = (feature: ProductFeature) => {
      if (selectedFeatures.some(f => f.id === feature.id)) {
        setSelectedFeatures(selectedFeatures.filter(f => f.id !== feature.id));
      } else {
        setSelectedFeatures([...selectedFeatures, feature]);
      }
    };
    
    const handleFormSubmit = (values: z.infer<typeof productFormSchema>) => {
      const productData = {
        ...values,
        allergens: selectedAllergens,
        features: selectedFeatures
      };
      
      onSubmit(productData);
    };

    return (
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Prodotto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome prodotto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Attivo</FormLabel>
                    <FormDescription>
                      Mostra questo prodotto nel menu
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descrizione del prodotto"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="space-y-2">
              <Label className="block">Caratteristiche</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {productFeatures.map((feature) => (
                  <div 
                    key={feature.id} 
                    className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                      selectedFeatures.some(f => f.id === feature.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature.title}
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <ImageUploader
                    currentImage={field.value || null}
                    onImageUploaded={(url) => field.onChange(url)}
                    label="Immagine Prodotto"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price_standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prezzo (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="has_price_suffix"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Suffisso prezzo</FormLabel>
                    <FormDescription>
                      Aggiungi un suffisso al prezzo (es. "al kg", "/persona", ecc.)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {hasPriceSuffix && (
              <FormField
                control={form.control}
                name="price_suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testo suffisso</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Es. al kg, /persona"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="label_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etichetta prodotto</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un'etichetta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nessuna etichetta</SelectItem>
                      {productLabels.map((label) => (
                        <SelectItem key={label.id} value={label.id}>
                          <div className="flex items-center">
                            {label.color && (
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: label.color }}
                              />
                            )}
                            {label.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="has_multiple_prices"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Prezzi multipli</FormLabel>
                    <FormDescription>
                      Abilita diverse varianti di prezzo
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {hasMultiplePrices && (
              <div className="border rounded-md p-4 space-y-4 bg-gray-50">
                <h4 className="font-medium">Varianti di prezzo</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="price_variant_1_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Variante 1</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Es. Bottiglia" value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price_variant_1_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prezzo Variante 1 (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : null;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="price_variant_2_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Variante 2</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Es. Calice" value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price_variant_2_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prezzo Variante 2 (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : null;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="block">Allergeni</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allergens.map((allergen) => (
                  <div 
                    key={allergen.id} 
                    className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                      selectedAllergens.some(a => a.id === allergen.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => toggleAllergen(allergen)}
                  >
                    {allergen.number}: {allergen.title}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (product) {
                    setIsEditing(false);
                  }
                }}
              >
                Annulla
              </Button>
              <Button type="submit">Salva</Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  const CategoriesList = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Categorie</h2>
          <Button onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" /> Nuova
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-2">
            {isLoadingCategories ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-1">
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nessuna categoria trovata.<br />
                    Crea una nuova categoria per iniziare.
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <div
                      key={category.id}
                      className={`flex flex-col p-2 rounded-md cursor-pointer ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {category.image_url ? (
                            <div className="w-8 h-8 rounded-md overflow-hidden">
                              <img
                                src={category.image_url}
                                alt={category.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                          <span className="truncate max-w-[120px]">{category.title}</span>
                        </div>
                        
                        {!category.is_active && (
                          <span className="text-sm px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                            Disattivata
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <div className="flex mr-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryReorder(category.id, 'up');
                            }}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryReorder(category.id, 'down');
                            }}
                            disabled={index === categories.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const ProductsList = () => {
    const filteredProducts = products.filter(
      product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const handleBackToCategories = () => {
      setShowMobileCategories(true);
      setShowMobileProducts(false);
    };
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={handleBackToCategories}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <Input
              placeholder="Cerca prodotti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button
            onClick={() => {
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
            }}
            size="sm"
            className="ml-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Nuovo
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-4">
            {!selectedCategory ? (
              <div className="text-center py-8 text-gray-500">
                Seleziona una categoria per visualizzare i prodotti.
              </div>
            ) : isLoadingProducts ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? 
                  "Nessun prodotto trovato per questa ricerca." : 
                  "Nessun prodotto in questa categoria."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`border rounded-md p-3 cursor-pointer transition-colors ${
                      selectedProduct === product.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-gray-50"
                    } ${!product.is_active ? "opacity-60" : ""}`}
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <div className="flex space-x-3">
                      {product.image_url ? (
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{product.title}</h3>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        )}
                        
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-sm font-semibold">{product.price_standard} €</span>
                          {product.has_price_suffix && product.price_suffix && (
                            <span className="text-xs text-gray-500">{product.price_suffix}</span>
                          )}
                          
                          {!product.is_active && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                              Non disponibile
                            </span>
                          )}
                          
                          {product.allergens && product.allergens.length > 0 && (
                            <div className="flex space-x-1">
                              {product.allergens.slice(0, 3).map((allergen) => (
                                <span 
                                  key={allergen.id}
                                  className="text-xs bg-gray-100 text-gray-700 px-1 rounded-full"
                                >
                                  {allergen.number}
                                </span>
                              ))}
                              {product.allergens.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-700 px-1 rounded-full">
                                  +{product.allergens.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <div className="flex mr-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductReorder(product.id, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductReorder(product.id, 'down');
                          }}
                          disabled={index === filteredProducts.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product.id);
                          setIsEditing(true);
                          
                          if (isMobile) {
                            setShowMobileProducts(false);
                            setShowMobileDetail(true);
                          }
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const ProductDetail = () => {
    const product = products.find(p => p.id === selectedProduct);
    
    const handleBackToProducts = () => {
      setShowMobileProducts(true);
      setShowMobileDetail(false);
    };
    
    if (!selectedProduct && !isEditing) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          Seleziona un prodotto per visualizzare i dettagli.
        </div>
      );
    }
    
    if (isEditing) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={handleBackToProducts}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">{product ? "Modifica Prodotto" : "Nuovo Prodotto"}</h2>
          </div>
          
          <ScrollArea className="flex-grow">
            <div className="p-4">
              <ProductForm 
                product={product} 
                onSubmit={(data) => {
                  if (product) {
                    handleUpdateProduct(product.id, data);
                  } else {
                    handleAddProduct(data);
                  }
                }} 
              />
            </div>
          </ScrollArea>
        </div>
      );
    }
    
    if (!product) return null;
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={handleBackToProducts}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold">Dettagli Prodotto</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Modifica
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            <div className="flex space-x-4">
              {product.image_url ? (
                <div className="w-32 h-32 rounded-md overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    {product.label && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-sm inline-block mt-1"
                        style={{ 
                          backgroundColor: product.label.color || '#e2e8f0',
                          color: product.label.color ? '#fff' : '#000'
                        }}
                      >
                        {product.label.title}
                      </span>
                    )}
                  </div>
                  {!product.is_active && (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      Non disponibile
                    </span>
                  )}
                </div>
                
                {product.description && (
                  <p className="text-gray-700 mt-2">{product.description}</p>
                )}
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium">Categoria: </span>
                    <span className="ml-2">
                      {categories.find(c => c.id === product.category_id)?.title || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>
                      {product.price_standard} €{' '}
                      {product.has_price_suffix && product.price_suffix && (
                        <span className="text-gray-500 text-base">{product.price_suffix}</span>
                      )}
                    </span>
                  </div>
                  {product.has_multiple_prices && (
                    <div className="flex flex-col gap-1">
                      {product.price_variant_1_name && product.price_variant_1_value != null && (
                        <div className="flex justify-between items-center">
                          <span>
                            {product.price_variant_1_value} €{' '}
                            <span className="text-gray-700 text-sm">
                              {product.price_variant_1_name}
                            </span>
                          </span>
                        </div>
                      )}
                      {product.price_variant_2_name && product.price_variant_2_value != null && (
                        <div className="flex justify-between items-center">
                          <span>
                            {product.price_variant_2_value} €{' '}
                            <span className="text-gray-700 text-sm">
                              {product.price_variant_2_name}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {product.features && product.features.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature) => (
                      <div 
                        key={feature.id}
                        className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
                      >
                        {feature.icon_url && (
                          <img src={feature.icon_url} alt={feature.title} className="w-4 h-4 mr-1" />
                        )}
                        {feature.title}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {product.allergens && product.allergens.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Allergeni</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen) => (
                      <div 
                        key={allergen.id}
                        className="bg-gray-100 rounded-full px-3 py-1"
                      >
                        {allergen.number}: {allergen.title}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Informazioni tecniche</h3>
                
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">ID</TableCell>
                      <TableCell>{product.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ordine di visualizzazione</TableCell>
                      <TableCell>{product.display_order}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Creato il</TableCell>
                      <TableCell>
                        {product.created_at && new Date(product.created_at).toLocaleDateString('it-IT')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ultimo aggiornamento</TableCell>
                      <TableCell>
                        {product.updated_at && new Date(product.updated_at).toLocaleDateString('it-IT')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  };

  const MobileLayout = () => {
    if (showMobileCategories) {
      return <CategoriesList />;
    } else if (showMobileProducts) {
      return <ProductsList />;
    } else if (showMobileDetail) {
      return <ProductDetail />;
    }
    
    return <CategoriesList />;
  };

  const DesktopLayout = () => (
    <div className="grid grid-cols-12 h-full divide-x">
      <div className="col-span-2 h-full border-r">
        <CategoriesList />
      </div>
      
      <div className="col-span-5 h-full border-r">
        <ProductsList />
      </div>
      
      <div className="col-span-5 h-full">
        <ProductDetail />
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)]">
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      
      <CategoryFormPanel />
    </div>
  );
};

export default Dashboard;
