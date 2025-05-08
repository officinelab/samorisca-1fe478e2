
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Category, Product, Allergen } from "@/types/database";
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
  
  // Stati per i pannelli laterali
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const isMobile = useIsMobile();

  // Carica le categorie, i prodotti e gli allergeni
  useEffect(() => {
    loadCategories();
    loadAllergens();
  }, []);

  // Carica le categorie
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setCategories(data || []);
      
      // Seleziona automaticamente la prima categoria se non è già selezionata
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

  // Carica gli allergeni
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

  // Carica i prodotti per categoria
  const loadProducts = async (categoryId: string) => {
    setIsLoadingProducts(true);
    try {
      // Carica i prodotti
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
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
          
          // Se ci sono allergeni, recupera i dettagli
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
          
          return { ...product, allergens: productAllergensDetails } as Product;
        })
      );
      
      setProducts(productsWithAllergens);
      // Reimposta il prodotto selezionato quando cambia la categoria
      setSelectedProduct(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error);
      toast.error("Errore nel caricamento dei prodotti. Riprova più tardi.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Gestisce la selezione di una categoria
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId);
    
    if (isMobile) {
      setShowMobileCategories(false);
      setShowMobileProducts(true);
      setShowMobileDetail(false);
    }
  };

  // Gestisce la selezione di un prodotto
  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setIsEditing(false);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
    }
  };

  // Cambia l'ordine di visualizzazione di una categoria
  const handleCategoryReorder = async (categoryId: string, direction: 'up' | 'down') => {
    // Trova l'indice della categoria corrente
    const currentIndex = categories.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return;

    // Calcola il nuovo indice
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Verifica che il nuovo indice sia valido
    if (newIndex < 0 || newIndex >= categories.length) return;
    
    // Crea una copia dell'array delle categorie
    const updatedCategories = [...categories];
    
    // Recupera le categorie coinvolte
    const category1 = updatedCategories[currentIndex];
    const category2 = updatedCategories[newIndex];
    
    // Scambia gli ordini di visualizzazione
    const tempOrder = category1.display_order;
    category1.display_order = category2.display_order;
    category2.display_order = tempOrder;
    
    // Aggiorna localmente l'array
    [updatedCategories[currentIndex], updatedCategories[newIndex]] = 
      [updatedCategories[newIndex], updatedCategories[currentIndex]];
    
    // Aggiorna lo stato
    setCategories(updatedCategories);
    
    try {
      // Aggiorna il database - ora includiamo tutti i campi richiesti
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
      // Ricarica le categorie in caso di errore
      loadCategories();
    }
  };

  // Cambia l'ordine di visualizzazione di un prodotto
  const handleProductReorder = async (productId: string, direction: 'up' | 'down') => {
    // Trova l'indice del prodotto corrente
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    // Calcola il nuovo indice
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Verifica che il nuovo indice sia valido
    if (newIndex < 0 || newIndex >= products.length) return;
    
    // Crea una copia dell'array dei prodotti
    const updatedProducts = [...products];
    
    // Recupera i prodotti coinvolti
    const product1 = updatedProducts[currentIndex];
    const product2 = updatedProducts[newIndex];
    
    // Scambia gli ordini di visualizzazione
    const tempOrder = product1.display_order;
    product1.display_order = product2.display_order;
    product2.display_order = tempOrder;
    
    // Aggiorna localmente l'array
    [updatedProducts[currentIndex], updatedProducts[newIndex]] = 
      [updatedProducts[newIndex], updatedProducts[currentIndex]];
    
    // Aggiorna lo stato
    setProducts(updatedProducts);
    
    try {
      // Aggiorna il database - ora includiamo tutti i campi richiesti
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
          price_variant_1_name: product1.price_variant_1_name,
          price_variant_1_value: product1.price_variant_1_value,
          price_variant_2_name: product1.price_variant_2_name,
          price_variant_2_value: product1.price_variant_2_value,
          has_price_suffix: product1.has_price_suffix,
          price_suffix: product1.price_suffix
        }
      ];
      
      const { error } = await supabase
        .from('products')
        .upsert(updates);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Errore nel riordinamento dei prodotti:', error);
      toast.error("Errore nel riordinamento dei prodotti. Riprova più tardi.");
      // Ricarica i prodotti in caso di errore
      if (selectedCategory) {
        loadProducts(selectedCategory);
      }
    }
  };

  // Aggiunge una nuova categoria
  const handleAddCategory = async (categoryData: Partial<Category>) => {
    try {
      // Determina il prossimo display_order
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      // Ensure title is provided (required by the database)
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
        // Aggiorna lo stato locale
        await loadCategories();
        // Se non è selezionata alcuna categoria, seleziona quella appena creata
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

  // Aggiorna una categoria esistente
  const handleUpdateCategory = async (categoryId: string, categoryData: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', categoryId);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      await loadCategories();
      
      toast.success("Categoria aggiornata con successo!");
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Errore nell\'aggiornamento della categoria:', error);
      toast.error("Errore nell'aggiornamento della categoria. Riprova più tardi.");
    }
  };

  // Elimina una categoria
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
      
      // Aggiorna lo stato locale
      await loadCategories();
      
      toast.success("Categoria eliminata con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione della categoria:', error);
      toast.error("Errore nell'eliminazione della categoria. Riprova più tardi.");
    }
  };

  // Aggiunge un nuovo prodotto
  const handleAddProduct = async (productData: Partial<Product>) => {
    if (!selectedCategory) {
      toast.error("Seleziona prima una categoria");
      return;
    }

    try {
      // Determina il prossimo display_order
      const maxOrder = Math.max(...products.map(p => p.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      if (!productData.title) {
        toast.error("Il titolo è obbligatorio");
        return;
      }
      
      const productToInsert = {
        title: productData.title,
        description: productData.description || null,
        image_url: productData.image_url || null,
        category_id: selectedCategory,
        is_active: productData.is_active !== undefined ? productData.is_active : true,
        display_order: nextOrder,
        price_standard: productData.price_standard || 0,
        has_multiple_prices: productData.has_multiple_prices || false,
        price_variant_1_name: productData.price_variant_1_name || null,
        price_variant_1_value: productData.price_variant_1_value || null,
        price_variant_2_name: productData.price_variant_2_name || null,
        price_variant_2_value: productData.price_variant_2_value || null,
        has_price_suffix: productData.has_price_suffix || false,
        price_suffix: productData.price_suffix || null
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([productToInsert])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Gestisci gli allergeni se presenti
        const allergens = productData.allergens || [];
        if (allergens.length > 0) {
          const allergenInserts = allergens.map(allergen => ({
            product_id: data[0].id,
            allergen_id: allergen.id,
          }));

          const { error: allergensError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (allergensError) throw allergensError;
        }

        // Aggiorna i prodotti
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

  // Aggiorna un prodotto esistente
  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      // Creiamo una copia dei dati del prodotto senza il campo allergens
      const { allergens, ...productUpdateData } = productData;
      
      // Aggiorniamo i dati del prodotto nella tabella products
      const { error } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      // Gestisci gli allergeni separatamente se sono presenti
      if (allergens !== undefined) {
        // Rimuovi tutte le associazioni esistenti
        const { error: deleteError } = await supabase
          .from('product_allergens')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        // Aggiungi le nuove associazioni se ce ne sono
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
      
      // Aggiorna i prodotti
      if (selectedCategory) {
        await loadProducts(selectedCategory);
      }
      
      // Riseleziona il prodotto aggiornato
      setSelectedProduct(productId);
      setIsEditing(false);
      
      toast.success("Prodotto aggiornato con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento del prodotto:', error);
      toast.error("Errore nell'aggiornamento del prodotto. Riprova più tardi.");
    }
  };

  // Elimina un prodotto
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
      
      // Aggiorna lo stato locale
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

  // Componente per il caricamento delle immagini
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

  // Schema di validazione per il form categoria
  const categoryFormSchema = z.object({
    title: z.string().min(1, "Il nome è obbligatorio"),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
    image_url: z.string().optional().nullable(),
  });

  // Schema di validazione per il form prodotto
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
  });

  // Form categoria
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

  // Form prodotto
  const ProductForm = ({ product, onSubmit }: { 
    product: Product | null, 
    onSubmit: (data: any) => void 
  }) => {
    const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(
      product?.allergens || []
    );
    
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
    
    const handleFormSubmit = (values: z.infer<typeof productFormSchema>) => {
      // Aggiungi gli allergeni ai valori del form
      const productData = {
        ...values,
        allergens: selectedAllergens
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
                  <FormLabel>Prezzo {hasMultiplePrices ? "Base" : ""}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...field} 
                      placeholder="Prezzo"
                    />
                  </FormControl>
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
                    <FormLabel>Prezzi Multipli</FormLabel>
                    <FormDescription>
                      Attiva per inserire varianti di prezzo
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
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price_variant_1_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Variante 1</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Es. Media"
                            value={field.value || ""}
                          />
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
                        <FormLabel>Prezzo Variante 1</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            placeholder="Prezzo"
                            value={field.value === null ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price_variant_2_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Variante 2</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Es. Grande"
                            value={field.value || ""}
                          />
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
                        <FormLabel>Prezzo Variante 2</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            placeholder="Prezzo"
                            value={field.value === null ? "" : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="has_price_suffix"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Suffisso Prezzo</FormLabel>
                    <FormDescription>
                      Attiva per aggiungere un suffisso al prezzo (es. "al kg")
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
                    <FormLabel>Suffisso Prezzo</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Es. al kg, all'etto..."
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
            
            <div>
              <h3 className="mb-2 text-lg font-semibold">Allergeni</h3>
              <div className="grid grid-cols-2 gap-2">
                {allergens.map((allergen) => (
                  <div 
                    key={allergen.id}
                    className={`
                      flex items-center p-2 rounded-md cursor-pointer transition-colors
                      ${selectedAllergens.some(a => a.id === allergen.id) 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'}
                    `}
                    onClick={() => toggleAllergen(allergen)}
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20">
                      {allergen.number}
                    </span>
                    {allergen.title}
                    {selectedAllergens.some(a => a.id === allergen.id) && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
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

  // Visualizza il prodotto selezionato
  const ProductDetail = ({ product }: { product: Product }) => {
    if (!product) return null;
    
    return (
      <div className="space-y-4">
        {product.image_url && (
          <div className="relative w-full h-48">
            <img 
              src={product.image_url} 
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-bold">{product.title}</h2>
          {product.description && (
            <p className="text-muted-foreground mt-1">{product.description}</p>
          )}
        </div>
        
        <div className="pt-2">
          <h3 className="font-semibold mb-1">Prezzo</h3>
          {product.has_multiple_prices ? (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Base:</span>
                <span>{product.price_standard.toFixed(2)} €{product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}</span>
              </div>
              {product.price_variant_1_name && product.price_variant_1_value !== null && (
                <div className="flex justify-between">
                  <span>{product.price_variant_1_name}:</span>
                  <span>{product.price_variant_1_value.toFixed(2)} €{product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}</span>
                </div>
              )}
              {product.price_variant_2_name && product.price_variant_2_value !== null && (
                <div className="flex justify-between">
                  <span>{product.price_variant_2_name}:</span>
                  <span>{product.price_variant_2_value.toFixed(2)} €{product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-between">
              <span>Prezzo:</span>
              <span>{product.price_standard.toFixed(2)} €{product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}</span>
            </div>
          )}
        </div>
        
        {product.allergens && product.allergens.length > 0 && (
          <div className="pt-2">
            <h3 className="font-semibold mb-1">Allergeni</h3>
            <div className="flex flex-wrap gap-2">
              {product.allergens.map((allergen) => (
                <span 
                  key={allergen.id}
                  className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-sm"
                >
                  <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20 text-xs">
                    {allergen.number}
                  </span>
                  {allergen.title}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-4 flex flex-row items-center justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifica
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleDeleteProduct(product.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Elimina
          </Button>
        </div>
      </div>
    );
  };

  // Rendering del componente principale
  return (
    <div className="h-full flex">
      {/* Pannello laterale per la gestione delle categorie */}
      <CategoryFormPanel />
      
      {/* Layout desktop */}
      {!isMobile && (
        <div className="flex h-full w-full">
          {/* Colonna delle categorie (larghezza ridotta) */}
          <div className="w-1/5 border-r min-h-screen">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg">Categorie</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowCategoryForm(true);
                    setEditingCategory(null);
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-2">
                {isLoadingCategories ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {categories
                      .filter(category => 
                        category.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((category) => (
                        <Card
                          key={category.id}
                          className={`
                            cursor-pointer border transition-colors
                            ${selectedCategory === category.id 
                              ? 'border-primary bg-muted' 
                              : 'hover:border-muted-foreground/50'}
                          `}
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">
                                  {category.title}
                                </span>
                                {!category.is_active && (
                                  <EyeOff className="h-3 w-3 text-muted-foreground ml-1" />
                                )}
                              </div>
                              <div className="flex items-center justify-end mt-2 space-x-1">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCategory(category);
                                    setShowCategoryForm(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryReorder(category.id, 'up');
                                  }}
                                  disabled={categories[0]?.id === category.id}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryReorder(category.id, 'down');
                                  }}
                                  disabled={categories[categories.length - 1]?.id === category.id}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Colonna dei prodotti (larghezza aumentata) */}
          <div className="w-2/5 border-r">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg">
                  {selectedCategory ? (
                    <>Prodotti in {categories.find(c => c.id === selectedCategory)?.title}</>
                  ) : (
                    <>Seleziona una categoria</>
                  )}
                </h2>
                {selectedCategory && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsEditing(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-2">
                {isLoadingProducts ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : !selectedCategory ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Seleziona una categoria per visualizzare i prodotti
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 opacity-50 mb-2" />
                    <p>Nessun prodotto in questa categoria</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSelectedProduct(null);
                        setIsEditing(true);
                      }}
                    >
                      Aggiungi il primo prodotto
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className={`
                          cursor-pointer border transition-colors
                          ${selectedProduct === product.id 
                            ? 'border-primary bg-muted' 
                            : 'hover:border-muted-foreground/50'}
                        `}
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              {product.image_url && (
                                <div className="h-12 w-12 mr-3 rounded-md overflow-hidden">
                                  <img 
                                    src={product.image_url} 
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium truncate">
                                    {product.title}
                                  </h3>
                                  {!product.is_active && (
                                    <EyeOff className="h-3 w-3 text-muted-foreground ml-1" />
                                  )}
                                </div>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {product.description}
                                  </p>
                                )}
                                <p className="text-sm">
                                  {product.has_multiple_prices ? (
                                    <>
                                      {product.price_standard.toFixed(2)} € - {" "}
                                      {product.price_variant_2_value ? product.price_variant_2_value.toFixed(2) : product.price_variant_1_value?.toFixed(2)} €
                                      {product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}
                                    </>
                                  ) : (
                                    <>
                                      {product.price_standard.toFixed(2)} €
                                      {product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-end mt-2 space-x-1">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProduct(product.id);
                                  setIsEditing(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(product.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductReorder(product.id, 'up');
                                }}
                                disabled={products[0]?.id === product.id}
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductReorder(product.id, 'down');
                                }}
                                disabled={products[products.length - 1]?.id === product.id}
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Colonna dei dettagli */}
          <div className="flex-1 p-4">
            <h2 className="font-semibold text-lg mb-4">
              {isEditing ? (
                selectedProduct ? "Modifica Prodotto" : "Nuovo Prodotto"
              ) : selectedProduct ? (
                "Dettagli Prodotto"
              ) : (
                "Seleziona un prodotto"
              )}
            </h2>
            
            {selectedProduct && !isEditing && (
              <ProductDetail product={products.find(p => p.id === selectedProduct)!} />
            )}
            
            {isEditing && (
              <ProductForm 
                product={selectedProduct ? products.find(p => p.id === selectedProduct)! : null} 
                onSubmit={(data) => {
                  if (selectedProduct) {
                    handleUpdateProduct(selectedProduct, data);
                  } else {
                    handleAddProduct(data);
                  }
                }}
              />
            )}
            
            {!selectedProduct && !isEditing && (
              <div className="py-8 text-center text-muted-foreground">
                <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
                <p>Seleziona un prodotto per visualizzare i dettagli</p>
                {selectedCategory && (
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Aggiungi un nuovo prodotto
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Layout mobile */}
      {isMobile && (
        <div className="flex flex-col h-full w-full">
          {/* Intestazione mobile con navigazione */}
          <div className="border-b p-3 flex items-center">
            {showMobileDetail && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => {
                  setShowMobileDetail(false);
                  setShowMobileProducts(true);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            {showMobileProducts && !showMobileDetail && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => {
                  setShowMobileProducts(false);
                  setShowMobileCategories(true);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <h2 className="font-semibold flex-1">
              {showMobileCategories && "Categorie"}
              {showMobileProducts && !showMobileDetail && (
                categories.find(c => c.id === selectedCategory)?.title || "Prodotti"
              )}
              {showMobileDetail && (
                isEditing ? "Modifica Prodotto" : products.find(p => p.id === selectedProduct)?.title || "Dettagli"
              )}
            </h2>
            
            {showMobileCategories && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowCategoryForm(true);
                  setEditingCategory(null);
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
            
            {showMobileProducts && !showMobileDetail && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedProduct(null);
                  setIsEditing(true);
                  setShowMobileDetail(true);
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Vista categorie mobile */}
          {showMobileCategories && (
            <div className="flex-1 overflow-auto">
              <div className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Cerca categoria..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isLoadingCategories ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories
                      .filter(category => 
                        category.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((category) => (
                        <Card
                          key={category.id}
                          className="border cursor-pointer"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">
                                    {category.title}
                                  </span>
                                  {!category.is_active && (
                                    <EyeOff className="h-3 w-3 text-muted-foreground ml-1 inline" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCategoryReorder(category.id, 'up');
                                    }}
                                    disabled={categories[0]?.id === category.id}
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCategoryReorder(category.id, 'down');
                                    }}
                                    disabled={categories[categories.length - 1]?.id === category.id}
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-end mt-2 space-x-1">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCategory(category);
                                    setShowCategoryForm(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Vista prodotti mobile */}
          {showMobileProducts && !showMobileDetail && (
            <div className="flex-1 overflow-auto">
              <div className="p-3">
                {isLoadingProducts ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 opacity-50 mb-2" />
                    <p>Nessun prodotto in questa categoria</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSelectedProduct(null);
                        setIsEditing(true);
                        setShowMobileDetail(true);
                      }}
                    >
                      Aggiungi il primo prodotto
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer border"
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex">
                            {product.image_url && (
                              <div className="h-14 w-14 mr-3 rounded-md overflow-hidden">
                                <img 
                                  src={product.image_url} 
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  {product.title}
                                </h3>
                                {!product.is_active && (
                                  <EyeOff className="h-3 w-3 text-muted-foreground ml-1" />
                                )}
                              </div>
                              {product.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {product.description}
                                </p>
                              )}
                              <p className="text-sm">
                                {product.has_multiple_prices ? (
                                  <>
                                    {product.price_standard.toFixed(2)} € - {" "}
                                    {product.price_variant_2_value ? product.price_variant_2_value.toFixed(2) : product.price_variant_1_value?.toFixed(2)} €
                                    {product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}
                                  </>
                                ) : (
                                  <>
                                    {product.price_standard.toFixed(2)} €
                                    {product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end mt-2 space-x-1">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product.id);
                                setIsEditing(true);
                                setShowMobileDetail(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductReorder(product.id, 'up');
                              }}
                              disabled={products[0]?.id === product.id}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductReorder(product.id, 'down');
                              }}
                              disabled={products[products.length - 1]?.id === product.id}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Vista dettagli mobile */}
          {showMobileDetail && (
            <div className="flex-1 overflow-auto p-3">
              {isEditing ? (
                <ProductForm 
                  product={selectedProduct ? products.find(p => p.id === selectedProduct)! : null} 
                  onSubmit={(data) => {
                    if (selectedProduct) {
                      handleUpdateProduct(selectedProduct, data);
                    } else {
                      handleAddProduct(data);
                    }
                  }}
                />
              ) : selectedProduct && (
                <ProductDetail product={products.find(p => p.id === selectedProduct)!} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
