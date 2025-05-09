import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Edit, Trash2, Plus, X, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { Category, Product, Allergen, ProductLabel, ProductFeature } from "@/types/database";
import { useMenuData } from "@/hooks/useMenuData";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Schema di validazione per il form del prodotto
const productFormSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  image_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  price_standard: z.number().optional().nullable(),
  has_multiple_prices: z.boolean().default(false),
  price_variant_1_name: z.string().optional().nullable(),
  price_variant_1_value: z.number().optional().nullable(),
  price_variant_2_name: z.string().optional().nullable(),
  price_variant_2_value: z.number().optional().nullable(),
  has_price_suffix: z.boolean().default(false),
  price_suffix: z.string().optional().nullable(),
  label_id: z.string().optional().nullable(),
});

// Schema di validazione per il form della categoria
const categoryFormSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  image_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export default function Dashboard() {
  const { categories, allergens, labels, features } = useMenuData();
  
  const [selectedTab, setSelectedTab] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  
  // Carica i prodotti quando viene selezionata una categoria
  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    }
  }, [selectedCategory]);
  
  // Carica i prodotti di una categoria
  const loadProducts = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, label:label_id(*)')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Per ogni prodotto, carica gli allergeni associati
      const productsWithAllergens = await Promise.all(
        (data || []).map(async (product) => {
          // Carica gli allergeni
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
              .in('id', allergenIds)
              .order('number', { ascending: true });
            
            if (detailsError) throw detailsError;
            productAllergensDetails = allergensDetails || [];
          }
          
          // Carica le caratteristiche
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
      
      setProducts(productsWithAllergens);
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error);
      toast.error("Errore nel caricamento dei prodotti. Riprova più tardi.");
    }
  };
  
  // Ottiene il prodotto selezionato
  const getSelectedProduct = () => {
    return products.find(p => p.id === selectedProduct) || null;
  };
  
  // Conferma l'eliminazione di un prodotto
  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };
  
  // Elimina un prodotto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      // Prima elimina le relazioni con gli allergeni
      const { error: allergensError } = await supabase
        .from('product_allergens')
        .delete()
        .eq('product_id', productToDelete);
      
      if (allergensError) throw allergensError;
      
      // Elimina le relazioni con le caratteristiche
      const { error: featuresError } = await supabase
        .from('product_to_features')
        .delete()
        .eq('product_id', productToDelete);
      
      if (featuresError) throw featuresError;
      
      // Poi elimina il prodotto
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);
      
      if (error) throw error;
      
      // Aggiorna la lista dei prodotti
      if (selectedCategory) {
        await loadProducts(selectedCategory);
      }
      
      // Deseleziona il prodotto se era quello selezionato
      if (selectedProduct === productToDelete) {
        setSelectedProduct(null);
      }
      
      toast.success("Prodotto eliminato con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione del prodotto:', error);
      toast.error("Errore nell'eliminazione del prodotto. Riprova più tardi.");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  
  // Conferma l'eliminazione di una categoria
  const confirmDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteCategoryDialogOpen(true);
  };
  
  // Elimina una categoria
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      // Verifica se ci sono prodotti associati
      const { data: categoryProducts, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', categoryToDelete);
      
      if (checkError) throw checkError;
      
      if (categoryProducts && categoryProducts.length > 0) {
        toast.error("Non è possibile eliminare una categoria con prodotti associati. Elimina prima i prodotti.");
        return;
      }
      
      // Elimina la categoria
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryToDelete);
      
      if (error) throw error;
      
      // Se la categoria eliminata era quella selezionata, deselezionala
      if (selectedCategory === categoryToDelete) {
        setSelectedCategory(null);
        setProducts([]);
      }
      
      toast.success("Categoria eliminata con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione della categoria:', error);
      toast.error("Errore nell'eliminazione della categoria. Riprova più tardi.");
    } finally {
      setIsDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
    }
  };
  
  // Sposta un prodotto su o giù nell'ordine di visualizzazione
  const moveProduct = async (productId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = products.findIndex(p => p.id === productId);
      if (currentIndex === -1) return;
      
      let swapIndex;
      if (direction === 'up' && currentIndex > 0) {
        swapIndex = currentIndex - 1;
      } else if (direction === 'down' && currentIndex < products.length - 1) {
        swapIndex = currentIndex + 1;
      } else {
        return; // Non fare nulla se non è possibile spostare
      }
      
      const currentProduct = products[currentIndex];
      const swapProduct = products[swapIndex];
      
      // Scambia gli ordini di visualizzazione
      const { error: error1 } = await supabase
        .from('products')
        .update({ display_order: swapProduct.display_order })
        .eq('id', currentProduct.id);
      
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('products')
        .update({ display_order: currentProduct.display_order })
        .eq('id', swapProduct.id);
      
      if (error2) throw error2;
      
      // Ricarica i prodotti
      if (selectedCategory) {
        await loadProducts(selectedCategory);
      }
    } catch (error) {
      console.error('Errore nello spostamento del prodotto:', error);
      toast.error("Errore nello spostamento del prodotto. Riprova più tardi.");
    }
  };
  
  // Sposta una categoria su o giù nell'ordine di visualizzazione
  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = categories.findIndex(c => c.id === categoryId);
      if (currentIndex === -1) return;
      
      let swapIndex;
      if (direction === 'up' && currentIndex > 0) {
        swapIndex = currentIndex - 1;
      } else if (direction === 'down' && currentIndex < categories.length - 1) {
        swapIndex = currentIndex + 1;
      } else {
        return; // Non fare nulla se non è possibile spostare
      }
      
      const currentCategory = categories[currentIndex];
      const swapCategory = categories[swapIndex];
      
      // Scambia gli ordini di visualizzazione
      const { error: error1 } = await supabase
        .from('categories')
        .update({ display_order: swapCategory.display_order })
        .eq('id', currentCategory.id);
      
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('categories')
        .update({ display_order: currentCategory.display_order })
        .eq('id', swapCategory.id);
      
      if (error2) throw error2;
      
      // Ricarica le categorie (questo verrà gestito dal hook useMenuData)
      toast.success("Ordine categorie aggiornato!");
    } catch (error) {
      console.error('Errore nello spostamento della categoria:', error);
      toast.error("Errore nello spostamento della categoria. Riprova più tardi.");
    }
  };
  
  // Componente per il form del prodotto
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
    
    // Carica le etichette prodotto e le caratteristiche
    const [productLabels, setProductLabels] = useState<ProductLabel[]>([]);
    const [productFeatures, setProductFeatures] = useState<ProductFeature[]>([]);
    
    useEffect(() => {
      const loadLabelsAndFeatures = async () => {
        try {
          // Carica le etichette
          const { data: labelsData, error: labelsError } = await supabase
            .from('product_labels')
            .select('*')
            .order('display_order', { ascending: true });
            
          if (labelsError) throw labelsError;
          setProductLabels(labelsData || []);
          
          // Carica le caratteristiche
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
    
    // Inizializza il form
    const form = useForm<z.infer<typeof productFormSchema>>({
      resolver: zodResolver(productFormSchema),
      defaultValues: {
        title: product?.title || "",
        description: product?.description || "",
        image_url: product?.image_url || "",
        is_active: product?.is_active !== undefined ? product.is_active : true,
        price_standard: product?.price_standard || null,
        has_multiple_prices: product?.has_multiple_prices || false,
        price_variant_1_name: product?.price_variant_1_name || "",
        price_variant_1_value: product?.price_variant_1_value || null,
        price_variant_2_name: product?.price_variant_2_name || "",
        price_variant_2_value: product?.price_variant_2_value || null,
        has_price_suffix: product?.has_price_suffix || false,
        price_suffix: product?.price_suffix || "",
        label_id: product?.label_id || "none",
      },
    });
    
    // Osserva il campo has_multiple_prices
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
      // Include both allergens and features in form submission data
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
                  <FormLabel>Titolo prodotto</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il titolo del prodotto" {...field} />
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
                      placeholder="Inserisci una descrizione (opzionale)" 
                      {...field} 
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
                  <FormLabel>URL immagine</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="URL dell'immagine (opzionale)" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Inserisci l'URL di un'immagine per il prodotto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Prodotto attivo</FormLabel>
                    <FormDescription>
                      Se selezionato, il prodotto sarà visibile nel menu
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
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
            
            <div className="space-y-4">
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormField
                  control={form.control}
                  name="has_multiple_prices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Prezzi multipli</FormLabel>
                        <FormDescription>
                          Se selezionato, puoi inserire fino a due varianti di prezzo
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {!hasMultiplePrices ? (
                <FormField
                  control={form.control}
                  name="price_standard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prezzo standard</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price_variant_1_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome variante 1</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Es. Piccola" 
                              {...field}
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
                          <FormLabel>Prezzo variante 1</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              value={field.value === null ? "" : field.value}
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
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
                          <FormLabel>Nome variante 2</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Es. Grande" 
                              {...field}
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
                          <FormLabel>Prezzo variante 2</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                              value={field.value === null ? "" : field.value}
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
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
              )}
              
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormField
                  control={form.control}
                  name="has_price_suffix"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Suffisso prezzo</FormLabel>
                        <FormDescription>
                          Se selezionato, puoi aggiungere un suffisso al prezzo (es. "al kg")
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {hasPriceSuffix && (
                <FormField
                  control={form.control}
                  name="price_suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffisso prezzo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Es. al kg" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
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
            
            {/* Caratteristiche prodotto */}
            <div className="space-y-2">
              <Label className="block">Caratteristiche prodotto</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {productFeatures.map((feature) => (
                  <div 
                    key={feature.id} 
                    className={`px-3 py-1 rounded-full border text-sm cursor-pointer flex items-center gap-1 ${
                      selectedFeatures.some(f => f.id === feature.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature.icon_url && (
                      <img src={feature.icon_url} alt={feature.title} className="w-4 h-4" />
                    )}
                    {feature.title}
                  </div>
                ))}
              </div>
              {productFeatures.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Non ci sono caratteristiche disponibili. Aggiungile prima nella sezione Impostazioni Menu.
                </p>
              )}
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
  
  // Componente per il form della categoria
  const CategoryForm = ({ category, onSubmit }: { 
    category: Category | null, 
    onSubmit: (data: z.infer<typeof categoryFormSchema>) => void 
  }) => {
    const form = useForm<z.infer<typeof categoryFormSchema>>({
      resolver: zodResolver(categoryFormSchema),
      defaultValues: {
        title: category?.title || "",
        description: category?.description || "",
        image_url: category?.image_url || "",
        is_active: category?.is_active !== undefined ? category.is_active : true,
      },
    });
  
    return (
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolo categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il titolo della categoria" {...field} />
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
                      placeholder="Inserisci una descrizione (opzionale)" 
                      {...field} 
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
                  <FormLabel>URL immagine</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="URL dell'immagine (opzionale)" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Inserisci l'URL di un'immagine per la categoria
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Categoria attiva</FormLabel>
                    <FormDescription>
                      Se selezionato, la categoria sarà visibile nel menu
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (category) {
                    setIsEditingCategory(false);
                  } else {
                    setIsAddingCategory(false);
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
  
  // Aggiunge una nuova categoria
  const handleAddCategory = async (data: z.infer<typeof categoryFormSchema>) => {
    try {
      // Determina il prossimo display_order
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      const { error } = await supabase
        .from('categories')
        .insert({
          title: data.title,
          description: data.description || null,
          image_url: data.image_url || null,
          is_active: data.is_active,
          display_order: nextOrder
        });
      
      if (error) throw error;
      
      // Azzera il form
      setIsAddingCategory(false);
      
      toast.success("Categoria aggiunta con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiunta della categoria:', error);
      toast.error("Errore nell'aggiunta della categoria. Riprova più tardi.");
    }
  };
  
  // Aggiorna una categoria esistente
  const handleUpdateCategory = async (data: z.infer<typeof categoryFormSchema>) => {
    if (!selectedCategoryForEdit) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          title: data.title,
          description: data.description || null,
          image_url: data.image_url || null,
          is_active: data.is_active
        })
        .eq('id', selectedCategoryForEdit.id);
      
      if (error) throw error;
      
      // Azzera il form
      setIsEditingCategory(false);
      setSelectedCategoryForEdit(null);
      
      toast.success("Categoria aggiornata con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento della categoria:', error);
      toast.error("Errore nell'aggiornamento della categoria. Riprova più tardi.");
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
      
      // Estrai features e allergens prima di inserire il prodotto
      const { features, allergens, ...productToInsert } = productData;
      
      // Handle the "none" value for label_id
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
      
      // Inserisci il nuovo prodotto
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert(productInsert)
        .select()
        .single();
      
      if (productError) throw productError;
      
      // Se ci sono allergens selezionati, inseriscili
      if (allergens && allergens.length > 0) {
        const allergenInserts = allergens.map((allergen) => ({
          product_id: newProduct.id,
          allergen_id: allergen.id
        }));
        
        const { error: allergensError } = await supabase
          .from('product_allergens')
          .insert(allergenInserts);
        
        if (allergensError) throw allergensError;
      }
      
      // Se ci sono features selezionate, inseriscile
      if (features && features.length > 0) {
        const featureInserts = features.map((feature) => ({
          product_id: newProduct.id,
          feature_id: feature.id
        }));
        
        const { error: featuresError } = await supabase
          .from('product_to_features')
          .insert(featureInserts);
        
        if (featuresError) throw featuresError;
      }
      
      // Aggiorna la lista dei prodotti
      await loadProducts(selectedCategory);
      
      // Azzera il form
      setIsAdding(false);
      
      toast.success("Prodotto aggiunto con successo!");
    } catch (error: any) {
      console.error('Errore nell\'aggiunta del prodotto:', error);
      toast.error(`Errore nell'aggiunta del prodotto: ${error.message || 'Riprova più tardi.'}`);
    }
  };
  
  // Aggiorna un prodotto esistente
  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      // Creiamo una copia dei dati del prodotto senza i campi allergens e features
      const { allergens, features, ...productUpdateData } = productData;
      
      // Handle the "none" value for label_id
      if (productUpdateData.label_id === "none") {
        productUpdateData.label_id = null;
      }
      
      // Aggiorniamo i dati del prodotto nella tabella products
      const { error } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      // Aggiorniamo gli allergeni: prima eliminiamo tutti quelli esistenti
      const { error: deleteAllergensError } = await supabase
        .from('product_allergens')
        .delete()
        .eq('product_id', productId);
      
      if (deleteAllergensError) throw deleteAllergensError;
      
      // Poi inseriamo i nuovi allergeni
      if (allergens && allergens.length > 0) {
        const allergenInserts = allergens.map((allergen) => ({
          product_id: productId,
          allergen_id: allergen.id
        }));
        
        const { error: insertAllergensError } = await supabase
          .from('product_allergens')
          .insert(allergenInserts);
        
        if (insertAllergensError) throw insertAllergensError;
      }
      
      // Aggiorniamo le caratteristiche: prima eliminiamo tutte quelle esistenti
      const { error: deleteFeaturesError } = await supabase
        .from('product_to_features')
        .delete()
        .eq('product_id', productId);
      
      if (deleteFeaturesError) throw deleteFeaturesError;
      
      // Poi inseriamo le nuove caratteristiche
      if (features && features.length > 0) {
        const featureInserts = features.map((feature) => ({
          product_id: productId,
          feature_id: feature.id
        }));
        
        const { error: insertFeaturesError } = await supabase
          .from('product_to_features')
          .insert(featureInserts);
        
        if (insertFeaturesError) throw insertFeaturesError;
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
  
  // Componente per visualizzare i dettagli di un prodotto
  const ProductDetail = ({ product }: { product: Product }) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{product.title}</h3>
            {product.description && (
              <p className="text-muted-foreground mt-1">{product.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifica
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => confirmDeleteProduct(product.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Elimina
            </Button>
          </div>
        </div>
        
        {/* Product image */}
        {product.image_url && (
          <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
  
        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Dettagli prodotto</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between py-1">
                <span className="text-sm">Attivo</span>
                <span className="text-sm font-medium">
                  {product.is_active ? (
                    <span className="text-green-600">Sì</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </span>
              </div>
              
              {product.label && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm">Etichetta</span>
                  <div className="flex items-center">
                    {product.label.color && (
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: product.label.color }}
                      />
                    )}
                    <span className="text-sm font-medium">{product.label.title}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Prezzi</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              {!product.has_multiple_prices ? (
                <div className="flex justify-between py-1">
                  <span className="text-sm">Prezzo standard</span>
                  <span className="text-sm font-medium">
                    {product.price_standard !== null ? 
                      `${product.price_standard}€${product.has_price_suffix && product.price_suffix ? ' ' + product.price_suffix : ''}` : 
                      "-"
                    }
                  </span>
                </div>
              ) : (
                <>
                  {product.price_variant_1_name && (
                    <div className="flex justify-between py-1">
                      <span className="text-sm">{product.price_variant_1_name}</span>
                      <span className="text-sm font-medium">
                        {product.price_variant_1_value !== null ? 
                          `${product.price_variant_1_value}€${product.has_price_suffix && product.price_suffix ? ' ' + product.price_suffix : ''}` : 
                          "-"
                        }
                      </span>
                    </div>
                  )}
                  {product.price_variant_2_name && (
                    <div className="flex justify-between py-1">
                      <span className="text-sm">{product.price_variant_2_name}</span>
                      <span className="text-sm font-medium">
                        {product.price_variant_2_value !== null ? 
                          `${product.price_variant_2_value}€${product.has_price_suffix && product.price_suffix ? ' ' + product.price_suffix : ''}` : 
                          "-"
                        }
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Product allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Allergeni</h4>
            <div className="flex flex-wrap gap-2">
              {product.allergens.map((allergen) => (
                <div 
                  key={allergen.id} 
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                >
                  {allergen.number}: {allergen.title}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Product features */}
        {product.features && product.features.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Caratteristiche</h4>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <div 
                  key={feature.id} 
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm flex items-center gap-1"
                >
                  {feature.icon_url && (
                    <img src={feature.icon_url} alt={feature.title} className="w-4 h-4" />
                  )}
                  {feature.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Gestisci il tuo menu, le categorie e i prodotti."
      />
      <Tabs defaultValue="products" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="products">Prodotti</TabsTrigger>
          <TabsTrigger value="categories">Categorie</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Colonna categorie */}
            <Card>
              <CardHeader>
                <CardTitle>Categorie</CardTitle>
                <CardDescription>
                  Seleziona una categoria per visualizzare i prodotti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div 
                        key={category.id}
                        className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                          selectedCategory === category.id 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center">
                          {!category.is_active && (
                            <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                          )}
                          <span>{category.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Colonna prodotti */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Prodotti</CardTitle>
                  <CardDescription>
                    {selectedCategory 
                      ? `${products.length} prodotti in questa categoria` 
                      : "Seleziona una categoria"}
                  </CardDescription>
                </div>
                {selectedCategory && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setIsAdding(true);
                      setSelectedProduct(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuovo
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {selectedCategory ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {products.map((product) => (
                        <div 
                          key={product.id}
                          className={`p-3 rounded-md cursor-pointer ${
                            selectedProduct === product.id 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedProduct(product.id);
                            setIsAdding(false);
                            setIsEditing(false);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {!product.is_active && (
                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                              )}
                              <span>{product.title}</span>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduct(product.id, 'up');
                                }}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveProduct(product.id, 'down');
                                }}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {product.label && (
                            <div className="flex items-center mt-1">
                              {product.label.color && (
                                <div 
                                  className="w-2 h-2 rounded-full mr-1" 
                                  style={{ backgroundColor: product.label.color }}
                                />
                              )}
                              <span className="text-xs">{product.label.title}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {products.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          Nessun prodotto in questa categoria
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Seleziona una categoria per visualizzare i prodotti
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Colonna dettagli/modifica */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isAdding 
                    ? "Nuovo prodotto" 
                    : isEditing 
                      ? "Modifica prodotto" 
                      : selectedProduct 
                        ? "Dettagli prodotto" 
                        : "Seleziona un prodotto"}
                </CardTitle>
                <CardDescription>
                  {isAdding 
                    ? "Aggiungi un nuovo prodotto alla categoria selezionata" 
                    : isEditing 
                      ? "Modifica i dettagli del prodotto" 
                      : selectedProduct 
                        ? "Visualizza i dettagli del prodotto selezionato" 
                        : "Seleziona un prodotto per visualizzarne i dettagli"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {isAdding && (
                    <ProductForm 
                      product={null} 
                      onSubmit={handleAddProduct} 
                    />
                  )}
                  {isEditing && selectedProduct && (
                    <ProductForm 
                      product={getSelectedProduct()} 
                      onSubmit={(data) => handleUpdateProduct(selectedProduct, data)} 
                    />
                  )}
                  {!isAdding && !isEditing && selectedProduct && getSelectedProduct() && (
                    <ProductDetail product={getSelectedProduct()!} />
                  )}
                  {!isAdding && !isEditing && !selectedProduct && (
                    <div className="text-center py-4 text-muted-foreground">
                      Seleziona un prodotto per visualizzarne i dettagli o aggiungi un nuovo prodotto
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestione Categorie</h2>
            <Button onClick={() => setIsAddingCategory(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuova Categoria
            </Button>
          </div>
          
          {isAddingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Nuova Categoria</CardTitle>
                <CardDescription>Aggiungi una nuova categoria al menu</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryForm 
                  category={null} 
                  onSubmit={handleAddCategory} 
                />
              </CardContent>
            </Card>
          )}
          
          {isEditingCategory && selectedCategoryForEdit && (
            <Card>
              <CardHeader>
                <CardTitle>Modifica Categoria</CardTitle>
                <CardDescription>Modifica i dettagli della categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryForm 
                  category={selectedCategoryForEdit} 
                  onSubmit={handleUpdateCategory} 
                />
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      {!category.is_active && (
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                      )}
                      {category.title}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => moveCategory(category.id, 'up')}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => moveCategory(category.id, 'down')}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {category.image_url && (
                    <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden mb-4">
                      <img 
                        src={category.image_url} 
                        alt={category.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedCategoryForEdit(category);
                        setIsEditingCategory(true);
                        setIsAddingCategory(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifica
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => confirmDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Elimina
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-2xl font-bold">Impostazioni Menu</h2>
          <p className="text-muted-foreground">
            Gestisci le impostazioni generali del menu, come etichette, allergeni e caratteristiche dei prodotti.
          </p>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Etichette Prodotti</h3>
            <p className="text-muted-foreground">
              Le etichette ti permettono di evidenziare prodotti speciali nel menu (es. "Novità", "Consigliato", ecc.)
            </p>
            
            {/* Qui andrebbe il componente per gestire le etichette */}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Allergeni</h3>
            <p className="text-muted-foreground">
              Gestisci l'elenco degli allergeni che possono essere associati ai prodotti
            </p>
            
            {/* Qui andrebbe il componente per gestire gli allergeni */}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Caratteristiche Prodotti</h3>
            <p className="text-muted-foreground">
              Gestisci le caratteristiche che possono essere associate ai prodotti (es. "Piccante", "Vegetariano", ecc.)
            </p>
            
            {/* Qui andrebbe il componente per gestire le caratteristiche */}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog di conferma eliminazione prodotto */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo prodotto?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il prodotto verrà rimosso permanentemente dal menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog di conferma eliminazione categoria */}
      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questa categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. La categoria verrà rimossa permanentemente dal menu.
              Non è possibile eliminare categorie che contengono prodotti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
