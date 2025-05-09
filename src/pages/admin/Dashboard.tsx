import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useMenuData } from '@/hooks/useMenuData';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Tag } from 'lucide-react';
import CollapsibleSection from '@/components/dashboard/CollapsibleSection';
import AdminLayout from '@/layouts/AdminLayout';
import { Product, Category, Allergen, ProductFeature } from '@/types/database';

// Add image uploader component
const ImageUploader = ({ value, onChange }: { value: string | null, onChange: (url: string | null) => void }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImageUrl(value || null);
  }, [value]);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
      setImageUrl(publicUrl);
      onChange(publicUrl);
      toast.success("Immagine caricata con successo!");
    } catch (error: any) {
      console.error("Errore durante il caricamento dell'immagine:", error.message);
      toast.error("Errore durante il caricamento dell'immagine.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={uploadImage}
        className="hidden"
      />
      <label htmlFor="image-upload" className="inline-block cursor-pointer rounded-md border bg-secondary px-3 py-2 text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        {uploading ? "Caricamento..." : "Carica Immagine"}
      </label>
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Anteprima" className="max-h-40 rounded-md object-cover" />
        </div>
      )}
    </div>
  );
};

// Schema for product validation 
const productSchema = z.object({
  title: z.string().min(1, "Il nome del prodotto è obbligatorio"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  image_url: z.string().nullable().optional(),
  category_id: z.string().min(1, "La categoria è obbligatoria"),
  label_id: z.string().nullable().optional(),
  price_standard: z.number().positive("Il prezzo deve essere maggiore di zero").optional(),
  has_price_suffix: z.boolean().default(false),
  price_suffix: z.string().optional(),
  has_multiple_prices: z.boolean().default(false),
  price_variant_1_name: z.string().optional(),
  price_variant_1_value: z.number().positive("Il prezzo deve essere maggiore di zero").optional(),
  price_variant_2_name: z.string().optional(),
  price_variant_2_value: z.number().positive("Il prezzo deve essere maggiore di zero").optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const Dashboard = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState<string | null>(null);
  const { categories, products, allergens, labels, features, isLoading } = useMenuData();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Form definition
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      is_active: true,
      image_url: null,
      category_id: "",
      label_id: null,
      price_standard: 0,
      has_price_suffix: false,
      price_suffix: "",
      has_multiple_prices: false,
      price_variant_1_name: "",
      price_variant_1_value: 0,
      price_variant_2_name: "",
      price_variant_2_value: 0,
    },
  });

  // Load products for selected category
  useEffect(() => {
    if (selectedCategoryForProducts) {
      const productsInCategory = products[selectedCategoryForProducts] || [];
      setProductsList(productsInCategory);
    } else {
      // If no category is selected, show all products
      const allProducts = Object.values(products).flat();
      setProductsList(allProducts);
    }
  }, [selectedCategoryForProducts, products]);

  // Reset form when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      form.reset({
        title: selectedProduct.title || "",
        description: selectedProduct.description || "",
        is_active: selectedProduct.is_active !== false,
        image_url: selectedProduct.image_url || null,
        category_id: selectedProduct.category_id || "",
        label_id: selectedProduct.label_id || null,
        price_standard: selectedProduct.price_standard || 0,
        has_price_suffix: selectedProduct.has_price_suffix || false,
        price_suffix: selectedProduct.price_suffix || "",
        has_multiple_prices: selectedProduct.has_multiple_prices || false,
        price_variant_1_name: selectedProduct.price_variant_1_name || "",
        price_variant_1_value: selectedProduct.price_variant_1_value || 0,
        price_variant_2_name: selectedProduct.price_variant_2_name || "",
        price_variant_2_value: selectedProduct.price_variant_2_value || 0,
      });
      
      // Set selected allergens
      if (selectedProduct.allergens) {
        setSelectedAllergens(selectedProduct.allergens.map(a => a.id));
      } else {
        setSelectedAllergens([]);
      }
      
      // Set selected features
      if (selectedProduct.features) {
        setSelectedFeatures(selectedProduct.features.map(f => f.id));
      } else {
        setSelectedFeatures([]);
      }
    } else {
      form.reset({
        title: "",
        description: "",
        is_active: true,
        image_url: null,
        category_id: selectedCategory || "",
        label_id: null,
        price_standard: 0,
        has_price_suffix: false,
        price_suffix: "",
        has_multiple_prices: false,
        price_variant_1_name: "",
        price_variant_1_value: 0,
        price_variant_2_name: "",
        price_variant_2_value: 0,
      });
      setSelectedAllergens([]);
      setSelectedFeatures([]);
    }
  }, [selectedProduct, selectedCategory, form]);

  const handleAllergenToggle = (allergenId: string) => {
    if (selectedAllergens.includes(allergenId)) {
      setSelectedAllergens(selectedAllergens.filter(id => id !== allergenId));
    } else {
      setSelectedAllergens([...selectedAllergens, allergenId]);
    }
  };
  
  const handleFeatureToggle = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const productData = {
        ...data,
        // Fix numeric values that might come as strings
        price_standard: data.price_standard ? Number(data.price_standard) : null,
        price_variant_1_value: data.price_variant_1_value ? Number(data.price_variant_1_value) : null,
        price_variant_2_value: data.price_variant_2_value ? Number(data.price_variant_2_value) : null,
      };
      
      let productId;
      
      if (selectedProduct) {
        // Update existing product
        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id)
          .select()
          .single();
          
        if (error) throw error;
        productId = selectedProduct.id;
        toast.success("Prodotto aggiornato con successo");
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
          
        if (error) throw error;
        productId = newProduct.id;
        toast.success("Prodotto creato con successo");
      }
      
      // Handle allergens
      if (selectedProduct) {
        // Delete existing allergen associations
        await supabase
          .from('product_allergens')
          .delete()
          .eq('product_id', productId);
      }
      
      // Add new allergen associations
      if (selectedAllergens.length > 0) {
        const allergenData = selectedAllergens.map(allergenId => ({
          product_id: productId,
          allergen_id: allergenId
        }));
        
        const { error: allergensError } = await supabase
          .from('product_allergens')
          .insert(allergenData);
          
        if (allergensError) throw allergensError;
      }
      
      // Handle features
      if (selectedProduct) {
        // Delete existing feature associations
        await supabase
          .from('product_to_features')
          .delete()
          .eq('product_id', productId);
      }
      
      // Add new feature associations
      if (selectedFeatures.length > 0) {
        const featuresData = selectedFeatures.map(featureId => ({
          product_id: productId,
          feature_id: featureId
        }));
        
        const { error: featuresError } = await supabase
          .from('product_to_features')
          .insert(featuresData);
          
        if (featuresError) throw featuresError;
      }
      
      // Reset form
      form.reset();
      setSelectedProduct(null);
      setSelectedAllergens([]);
      setSelectedFeatures([]);
      
    } catch (error) {
      console.error("Errore durante il salvataggio del prodotto:", error);
      toast.error("Errore durante il salvataggio");
    }
  };

  // Cancel form
  const handleCancel = () => {
    form.reset();
    setSelectedProduct(null);
    setSelectedAllergens([]);
    setSelectedFeatures([]);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First column - Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Categorie</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="py-2">
                  <button
                    onClick={() => {
                      setSelectedCategoryForProducts(category.id);
                      setSelectedCategory(category.id);
                      setSelectedProduct(null);
                    }}
                    className={`w-full text-left hover:bg-gray-100 py-2 px-4 rounded ${
                      selectedCategoryForProducts === category.id ? 'bg-gray-200' : ''
                    }`}
                  >
                    {category.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Second column - Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Prodotti</h2>
            <ul>
              {productsList.map((product) => (
                <li key={product.id} className="py-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className={`w-full text-left hover:bg-gray-100 py-2 px-4 rounded ${
                      selectedProduct?.id === product.id ? 'bg-gray-200' : ''
                    }`}
                  >
                    {product.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Third column - Product Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Main Product Information */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Prodotto</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome del prodotto" {...field} />
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
                        <FormLabel>Stato Attivo</FormLabel>
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
                          placeholder="Descrizione del prodotto"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Immagine Prodotto</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona una categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
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
                          <SelectItem value="">Nessuna etichetta</SelectItem>
                          {labels.map((label) => (
                            <SelectItem key={label.id} value={label.id}>
                              <div className="flex items-center">
                                {label.color && (
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2" 
                                    style={{ backgroundColor: label.color }} 
                                  />
                                )}
                                <span>{label.title}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                {/* Collapsible Features Section */}
                <CollapsibleSection title="Caratteristiche">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {features.map((feature) => (
                      <div
                        key={feature.id}
                        onClick={() => handleFeatureToggle(feature.id)}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full cursor-pointer border ${
                          selectedFeatures.includes(feature.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        <span>{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
                
                <Separator className="my-6" />
                
                {/* Price Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Informazioni di Prezzo</h3>
                  
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
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            value={field.value || ''}
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
                  
                  {form.watch('has_price_suffix') && (
                    <FormField
                      control={form.control}
                      name="price_suffix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testo suffisso</FormLabel>
                          <FormControl>
                            <Input placeholder="es. /kg, /porzione" {...field} value={field.value || ''} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="has_multiple_prices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Prezzi multipli</FormLabel>
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
                
                {form.watch('has_multiple_prices') && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <h4 className="text-sm font-medium">Varianti di prezzo</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="price_variant_1_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Variante 1</FormLabel>
                            <FormControl>
                              <Input placeholder="es. Media" {...field} value={field.value || ''} />
                            </FormControl>
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
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value || ''}
                              />
                            </FormControl>
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
                              <Input placeholder="es. Grande" {...field} value={field.value || ''} />
                            </FormControl>
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
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value || ''}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {/* Collapsible Allergens Section */}
                <CollapsibleSection title="Allergeni">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allergens.map((allergen) => (
                      <div
                        key={allergen.id}
                        onClick={() => handleAllergenToggle(allergen.id)}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full cursor-pointer border ${
                          selectedAllergens.includes(allergen.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <span>{allergen.number}. {allergen.title}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    Salva
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
