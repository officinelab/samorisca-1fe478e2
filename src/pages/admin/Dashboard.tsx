import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";

import { useMenuData } from "@/hooks/useMenuData";
import { Product, Category, Allergen, ProductLabel, ProductFeature } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import ImageUploader from "@/components/ImageUploader";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import FormField from "@/components/ui/form-field";

interface DashboardProps { }

const productSchema = z.object({
  category_id: z.string().min(1, {
    message: "Seleziona una categoria.",
  }),
  title: z.string().min(2, {
    message: "Il titolo deve essere di almeno 2 caratteri.",
  }),
  description: z.string().optional(),
  image_url: z.string().optional(),
  label_id: z.string().optional(),
  price_standard: z.string().optional(),
  has_price_suffix: z.boolean().default(false).optional(),
  price_suffix: z.string().optional(),
  has_multiple_prices: z.boolean().default(false).optional(),
  price_variant_1_name: z.string().optional(),
  price_variant_1_value: z.string().optional(),
  price_variant_2_name: z.string().optional(),
  price_variant_2_value: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
})

const Dashboard: React.FC<DashboardProps> = () => {
  const {
    categories,
    products,
    allergens,
    labels,
    features,
    isLoading,
    selectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useMenuData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [editProductImage, setEditProductImage] = useState<string | null>(null);
  const [newProductAllergens, setNewProductAllergens] = useState<Allergen[] | null>(null);
  const [editProductAllergens, setEditProductAllergens] = useState<Allergen[] | null>(null);
  const [newProductFeatures, setNewProductFeatures] = useState<ProductFeature[] | null>(null);
  const [editProductFeatures, setEditProductFeatures] = useState<ProductFeature[] | null>(null);

  const newProductForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: "",
      title: "",
      description: "",
      image_url: "",
      label_id: "",
      price_standard: "",
      has_price_suffix: false,
      price_suffix: "",
      has_multiple_prices: false,
      price_variant_1_name: "",
      price_variant_1_value: "",
      price_variant_2_name: "",
      price_variant_2_value: "",
      is_active: true,
    },
  });

  const editProductForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: editingProduct || {
      category_id: "",
      title: "",
      description: "",
      image_url: "",
      label_id: "",
      price_standard: "",
      has_price_suffix: false,
      price_suffix: "",
      has_multiple_prices: false,
      price_variant_1_name: "",
      price_variant_1_value: "",
      price_variant_2_name: "",
      price_variant_2_value: "",
      is_active: true,
    },
    values: editingProduct
  });

  useEffect(() => {
    if (editingProduct) {
      editProductForm.reset(editingProduct);
      setEditProductImage(editingProduct.image_url || null);
      
      // Carica gli allergeni associati al prodotto in modifica
      const loadProductAllergens = async () => {
        const { data: productAllergens, error: allergensError } = await supabase
          .from('product_allergens')
          .select('allergen_id')
          .eq('product_id', editingProduct.id);
        
        if (allergensError) throw allergensError;
        
        if (productAllergens && productAllergens.length > 0) {
          const allergenIds = productAllergens.map(pa => pa.allergen_id);
          const selectedAllergens = allergens.filter(allergen => allergenIds.includes(allergen.id));
          setEditProductAllergens(selectedAllergens);
        } else {
          setEditProductAllergens([]);
        }
      };
      
      // Carica le caratteristiche associate al prodotto in modifica
      const loadProductFeatures = async () => {
        const { data: productFeatures, error: featuresError } = await supabase
          .from('product_to_features')
          .select('feature_id')
          .eq('product_id', editingProduct.id);
        
        if (featuresError) throw featuresError;
        
        if (productFeatures && productFeatures.length > 0) {
          const featureIds = productFeatures.map(pf => pf.feature_id);
          const selectedFeatures = features.filter(feature => featureIds.includes(feature.id));
          setEditProductFeatures(selectedFeatures);
        } else {
          setEditProductFeatures([]);
        }
      };
      
      loadProductAllergens();
      loadProductFeatures();
    } else {
      editProductForm.reset();
      setEditProductImage(null);
      setEditProductAllergens(null);
      setEditProductFeatures(null);
    }
  }, [editingProduct, allergens, features, editProductForm]);

  const resetNewProductForm = () => {
    newProductForm.reset();
    setNewProductImage(null);
    setNewProductAllergens(null);
    setNewProductFeatures(null);
  };

  const handleNewProductCancel = () => {
    resetNewProductForm();
  };

  const handleEditProductCancel = () => {
    setEditingProduct(null);
  };

  const handleEditProductSubmit = async (values: z.infer<typeof productSchema>) => {
    if (!selectedProduct) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepara dati per l'aggiornamento
      const productData = {
        ...values,
        title: values.title || '',
        image_url: editProductImage,
        price_standard: Number(values.price_standard || 0),
        price_variant_1_value: Number(values.price_variant_1_value || 0),
        price_variant_2_value: Number(values.price_variant_2_value || 0),
        updated_at: new Date()
      };
      
      // Aggiorna il prodotto esistente
      const { data: updatedProduct, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', selectedProduct.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Aggiorna allergeni associati
      // 1. Rimuovi tutti gli allergeni esistenti per il prodotto
      const { error: deleteAllergensError } = await supabase
        .from('product_allergens')
        .delete()
        .eq('product_id', selectedProduct.id);
        
      if (deleteAllergensError) throw deleteAllergensError;
      
      // 2. Inserisci i nuovi allergeni selezionati
      if (updatedProduct && editProductAllergens?.length > 0) {
        const allergenData = editProductAllergens.map(allergen => ({
          product_id: updatedProduct.id,
          allergen_id: allergen.id
        }));
        
        const { error: allergensError } = await supabase
          .from('product_allergens')
          .insert(allergenData);
          
        if (allergensError) throw allergensError;
      }
      
      // Aggiorna caratteristiche associate
      // 1. Rimuovi tutte le caratteristiche esistenti per il prodotto
      const { error: deleteAllFeaturesError } = await supabase
        .from('product_to_features')
        .delete()
        .eq('product_id', selectedProduct.id);
        
      if (deleteAllFeaturesError) throw deleteAllFeaturesError;
      
      // 2. Inserisci le nuove caratteristiche selezionate
      if (updatedProduct && editProductFeatures?.length > 0) {
        const featuresData = editProductFeatures.map(feature => ({
          product_id: updatedProduct.id,
          feature_id: feature.id
        }));
        
        const { error: featuresError } = await supabase
          .from('product_to_features')
          .insert(featuresData);
          
        if (featuresError) throw featuresError;
      }
      
      toast.success('Prodotto modificato con successo!');
      setEditingProduct(null);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
      toast.error('Errore durante l\'aggiornamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct(product);
  };

  // Struttura del modulo per l'aggiunta/modifica di un prodotto
  const renderProductForm = (formType: 'new' | 'edit') => {
    const isNewForm = formType === 'new';
    const form = isNewForm ? newProductForm : editProductForm;
    const formTitle = isNewForm ? 'Nuovo Prodotto' : 'Modifica Prodotto';
    const productToEdit = isNewForm ? null : selectedProduct;
    const onSubmit = isNewForm ? handleNewProductSubmit : handleEditProductSubmit;
    const onCancel = isNewForm ? handleNewProductCancel : handleEditProductCancel;
    
    return (
      <div className="rounded-md border p-4">
        <h2 className="text-xl font-semibold mb-4">{formTitle}</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome Prodotto */}
          <FormField
            form={form}
            name="title"
            label="Nome Prodotto"
          >
            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </FormField>
          
          {/* Stato Attivo */}
          <FormField
            form={form}
            name="is_active"
            label="Stato Attivo"
          >
            <Switch />
          </FormField>
          
          {/* Descrizione */}
          <FormField
            form={form}
            name="description"
            label="Descrizione"
          >
            <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </FormField>
          
          {/* Immagine Prodotto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Immagine Prodotto</label>
            <ImageUploader
              path={`products/${formType === 'new' ? 'new' : productToEdit?.id}`}
              url={formType === 'new' ? newProductImage : editProductImage}
              onUpload={(url) => {
                if (formType === 'new') {
                  setNewProductImage(url);
                  form.setValue('image_url', url);
                } else {
                  setEditProductImage(url);
                  form.setValue('image_url', url);
                }
              }}
            />
          </div>
          
          {/* Etichetta prodotto */}
          <FormField
            form={form}
            name="label_id"
            label="Etichetta prodotto"
          >
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un'etichetta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nessuna etichetta</SelectItem>
                {labels.map((label) => (
                  <SelectItem key={label.id} value={label.id}>
                    <div className="flex items-center">
                      {label.color && (
                        <span
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
          </FormField>
          
          {/* Caratteristiche - Sezione espandibile */}
          <CollapsibleSection title="Caratteristiche">
            <div className="flex flex-wrap gap-2 mt-2">
              {features.map(feature => (
                <div
                  key={feature.id}
                  onClick={() => {
                    const currentFeatures = formType === 'new'
                      ? [...(newProductFeatures || [])]
                      : [...(editProductFeatures || [])];
                      
                    const featureIndex = currentFeatures.findIndex(f => f.id === feature.id);
                    
                    if (featureIndex >= 0) {
                      currentFeatures.splice(featureIndex, 1);
                    } else {
                      currentFeatures.push(feature);
                    }
                    
                    if (formType === 'new') {
                      setNewProductFeatures(currentFeatures);
                    } else {
                      setEditProductFeatures(currentFeatures);
                    }
                  }}
                  className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                    (formType === 'new' ? newProductFeatures : editProductFeatures)?.some(f => f.id === feature.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {feature.title}
                </div>
              ))}
            </div>
          </CollapsibleSection>
          
          {/* Campi per il prezzo */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Dettagli prezzo</h3>
            
            {/* Prezzo standard */}
            <FormField
              form={form}
              name="price_standard"
              label="Prezzo standard"
            >
              <input 
                type="number" 
                step="0.01" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              />
            </FormField>
            
            {/* Suffisso prezzo */}
            <FormField
              form={form}
              name="has_price_suffix"
              label="Suffisso prezzo"
            >
              <Switch />
            </FormField>
            
            {/* Testo suffisso - condizionale */}
            {form.watch('has_price_suffix') && (
              <FormField
                form={form}
                name="price_suffix"
                label="Testo suffisso"
              >
                <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </FormField>
            )}
            
            {/* Switch per prezzi multipli */}
            <FormField
              form={form}
              name="has_multiple_prices"
              label="Prezzi multipli"
            >
              <Switch />
            </FormField>
            
            {/* Sezione Varianti prezzi - condizionale */}
            {form.watch('has_multiple_prices') && (
              <div className="space-y-4 border rounded-md p-3">
                <h4 className="text-sm font-medium">Varianti prezzi</h4>
                
                {/* Nome Variante 1 */}
                <FormField
                  form={form}
                  name="price_variant_1_name"
                  label="Nome Variante 1"
                >
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </FormField>
                
                {/* Prezzo Variante 1 */}
                <FormField
                  form={form}
                  name="price_variant_1_value"
                  label="Prezzo Variante 1"
                >
                  <input 
                    type="number" 
                    step="0.01" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                </FormField>
                
                {/* Nome Variante 2 */}
                <FormField
                  form={form}
                  name="price_variant_2_name"
                  label="Nome Variante 2"
                >
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </FormField>
                
                {/* Prezzo Variante 2 */}
                <FormField
                  form={form}
                  name="price_variant_2_value"
                  label="Prezzo Variante 2"
                >
                  <input 
                    type="number" 
                    step="0.01" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                </FormField>
              </div>
            )}
          </div>
          
          {/* Sezione Allergeni - Sezione espandibile */}
          <CollapsibleSection title="Allergeni">
            <div className="flex flex-wrap gap-2 mt-2">
              {allergens.map(allergen => (
                <div
                  key={allergen.id}
                  onClick={() => {
                    const currentAllergens = formType === 'new'
                      ? [...(newProductAllergens || [])]
                      : [...(editProductAllergens || [])];
                      
                    const allergenIndex = currentAllergens.findIndex(a => a.id === allergen.id);
                    
                    if (allergenIndex >= 0) {
                      currentAllergens.splice(allergenIndex, 1);
                    } else {
                      currentAllergens.push(allergen);
                    }
                    
                    if (formType === 'new') {
                      setNewProductAllergens(currentAllergens);
                    } else {
                      setEditProductAllergens(currentAllergens);
                    }
                  }}
                  className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                    (formType === 'new' ? newProductAllergens : editProductAllergens)?.some(a => a.id === allergen.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {allergen.number && `${allergen.number}. `}{allergen.title}
                </div>
              ))}
            </div>
          </CollapsibleSection>
          
          {/* Pulsanti di azione */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Annulla
            </Button>
            <Button type="submit">
              Salva
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const handleNewProductSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Prepara dati per il salvataggio
      const productData = {
        ...values,
        title: values.title || '',
        image_url: newProductImage,
        price_standard: Number(values.price_standard || 0),
        price_variant_1_value: Number(values.price_variant_1_value || 0),
        price_variant_2_value: Number(values.price_variant_2_value || 0),
        display_order: 0
      };
      
      // Inserisci nuovo prodotto
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Aggiorna allergeni associati
      if (newProduct && newProductAllergens?.length > 0) {
        const allergenData = newProductAllergens.map(allergen => ({
          product_id: newProduct.id,
          allergen_id: allergen.id
        }));
        
        const { error: allergensError } = await supabase
          .from('product_allergens')
          .insert(allergenData);
          
        if (allergensError) throw allergensError;
      }
      
      // Aggiorna caratteristiche associate
      if (newProduct && newProductFeatures?.length > 0) {
        const featuresData = newProductFeatures.map(feature => ({
          product_id: newProduct.id,
          feature_id: feature.id
        }));
        
        const { error: featuresError } = await supabase
          .from('product_to_features')
          .insert(featuresData);
          
        if (featuresError) throw featuresError;
      }
      
      toast.success('Prodotto creato con successo!');
      resetNewProductForm();
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div>Caricamento...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestione Menu</h1>
      
      <div className="grid gap-6 md:grid-cols-[1fr,400px]">
        {/* Lista prodotti */}
        <div className="space-y-4">
          {/* Filtri e controlli */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Elenco Prodotti</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleToggleAllCategories}>
                {selectedCategories.length === categories.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
              </Button>
            </div>
          </div>
          
          {/* Filtro categorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`cursor-pointer rounded-full px-3 py-1 text-sm ${selectedCategories.includes(category.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
              >
                {category.title}
              </div>
            ))}
          </div>
          
          {/* Elenco prodotti */}
          <div className="grid gap-4">
            {Object.entries(products)
              .filter(([categoryId]) => selectedCategories.includes(categoryId))
              .flatMap(([, productList]) => productList)
              .map((product) => (
                <div
                  key={product.id}
                  className="rounded-md border p-4 cursor-pointer hover:bg-accent"
                  onClick={() => handleProductClick(product)}
                >
                  <h3 className="text-lg font-medium">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              ))}
          </div>
        </div>
        
        {/* Pannello laterale */}
        <div className="space-y-6">
          {/* Form nuovo prodotto o modifica prodotto */}
          {editingProduct ? renderProductForm('edit') : renderProductForm('new')}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
