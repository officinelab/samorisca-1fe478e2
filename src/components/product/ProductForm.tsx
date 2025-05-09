
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues, formValuesToProduct } from "@/types/form";
import { Product, ProductLabel } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/components/ImageUploader";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";

interface ProductFormProps {
  product?: Product;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Inizializza il form con i dati del prodotto
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? productToFormValues(product) : {
      is_active: true,
      has_price_suffix: false,
      has_multiple_prices: false,
    }
  });
  
  const { watch, setValue } = form;
  const hasPriceSuffix = watch("has_price_suffix");
  const hasMultiplePrices = watch("has_multiple_prices");
  
  // Carica le etichette dei prodotti
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const { data } = await supabase
          .from("product_labels")
          .select("*")
          .order("display_order", { ascending: true });
          
        setLabels(data || []);
      } catch (error) {
        console.error("Errore nel caricamento delle etichette:", error);
      }
    };
    
    fetchLabels();
  }, []);
  
  // Carica gli allergeni associati al prodotto
  useEffect(() => {
    if (product?.id) {
      const fetchProductAllergens = async () => {
        try {
          const { data } = await supabase
            .from("product_allergens")
            .select("allergen_id")
            .eq("product_id", product.id);
            
          if (data) {
            const allergenIds = data.map(item => item.allergen_id);
            setSelectedAllergens(allergenIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento degli allergeni del prodotto:", error);
        }
      };
      
      fetchProductAllergens();
    }
  }, [product?.id]);
  
  // Carica le caratteristiche associate al prodotto
  useEffect(() => {
    if (product?.id) {
      const fetchProductFeatures = async () => {
        try {
          const { data } = await supabase
            .from("product_to_features")
            .select("feature_id")
            .eq("product_id", product.id);
            
          if (data) {
            const featureIds = data.map(item => item.feature_id);
            setSelectedFeatures(featureIds);
          }
        } catch (error) {
          console.error("Errore nel caricamento delle caratteristiche del prodotto:", error);
        }
      };
      
      fetchProductFeatures();
    }
  }, [product?.id]);

  // Gestisce il salvataggio del prodotto
  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Converte i valori del form in un oggetto prodotto
      const productData = formValuesToProduct(values, product?.id);
      
      // Inserisce o aggiorna il prodotto
      const operation = product?.id ? "update" : "insert";
      const { data: savedProduct, error } = await supabase
        .from("products")
        [operation](productData, { onConflict: product?.id ? "id" : undefined });
      
      if (error) throw error;
      
      // Ottiene l'ID del prodotto salvato
      const productId = operation === "update" ? product.id : savedProduct?.[0]?.id;
      
      if (!productId) throw new Error("Impossibile ottenere l'ID del prodotto");
      
      // Gestisce gli allergeni
      if (selectedAllergens.length > 0) {
        // Rimuove gli allergeni esistenti
        await supabase
          .from("product_allergens")
          .delete()
          .eq("product_id", productId);
          
        // Inserisce i nuovi allergeni
        const allergenInserts = selectedAllergens.map(allergenId => ({
          product_id: productId,
          allergen_id: allergenId
        }));
        
        const { error: allergenError } = await supabase
          .from("product_allergens")
          .insert(allergenInserts);
          
        if (allergenError) throw allergenError;
      }
      
      // Gestisce le caratteristiche
      if (selectedFeatures.length > 0) {
        // Rimuove le caratteristiche esistenti
        await supabase
          .from("product_to_features")
          .delete()
          .eq("product_id", productId);
          
        // Inserisce le nuove caratteristiche
        const featureInserts = selectedFeatures.map(featureId => ({
          product_id: productId,
          feature_id: featureId
        }));
        
        const { error: featureError } = await supabase
          .from("product_to_features")
          .insert(featureInserts);
          
        if (featureError) throw featureError;
      }
      
      toast.success(product?.id ? "Prodotto aggiornato con successo" : "Prodotto creato con successo");
      
      if (onSave) onSave();
    } catch (error: any) {
      console.error("Errore durante il salvataggio del prodotto:", error);
      toast.error(`Errore: ${error.message || "Si è verificato un errore durante il salvataggio"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Converte i dati del prodotto nel formato del form
  function productToFormValues(product: Product): ProductFormValues {
    return {
      title: product.title || "",
      description: product.description || "",
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      label_id: product.label_id || "",
      price_standard: product.price_standard?.toString() || "",
      has_price_suffix: Boolean(product.has_price_suffix),
      price_suffix: product.price_suffix || "",
      has_multiple_prices: Boolean(product.has_multiple_prices),
      price_variant_1_name: product.price_variant_1_name || "",
      price_variant_1_value: product.price_variant_1_value?.toString() || "",
      price_variant_2_name: product.price_variant_2_name || "",
      price_variant_2_value: product.price_variant_2_value?.toString() || "",
      is_active: product.is_active !== undefined ? product.is_active : true,
    };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Nome Prodotto */}
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

        {/* Stato Attivo */}
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

        {/* Descrizione */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrizione del prodotto"
                  className="min-h-32"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Immagine Prodotto */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immagine Prodotto</FormLabel>
              <FormControl>
                <ImageUploader
                  currentImage={field.value || ""}
                  onImageUploaded={(url) => {
                    field.onChange(url);
                  }}
                  label="Carica immagine del prodotto"
                  bucketName="products"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Etichetta Prodotto */}
        <FormField
          control={form.control}
          name="label_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etichetta prodotto</FormLabel>
              <Select 
                value={field.value || ""} 
                onValueChange={field.onChange}
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
                      <div className="flex items-center gap-2">
                        {label.color && (
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                        )}
                        <span>{label.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Caratteristiche - Sezione espandibile */}
        <FeaturesSelector
          selectedFeatureIds={selectedFeatures}
          onChange={setSelectedFeatures}
        />

        {/* Campi per il prezzo */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Informazioni Prezzo</h3>
          
          {/* Prezzo Standard */}
          <FormField
            control={form.control}
            name="price_standard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prezzo Standard</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Suffisso Prezzo */}
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

          {/* Testo Suffisso (condizionale) */}
          {hasPriceSuffix && (
            <FormField
              control={form.control}
              name="price_suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testo suffisso</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="es. /persona, /kg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Prezzi Multipli */}
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

          {/* Varianti Prezzo (condizionale) */}
          {hasMultiplePrices && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <h4 className="text-md font-medium">Varianti di prezzo</h4>
              
              {/* Variante 1 */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_variant_1_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Variante 1</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="es. Piccola"
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
                      <FormLabel>Prezzo Variante 1</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Variante 2 */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price_variant_2_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Variante 2</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="es. Grande"
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
                      <FormLabel>Prezzo Variante 2</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Allergeni - Sezione espandibile */}
        <AllergenSelector
          selectedAllergenIds={selectedAllergens}
          onChange={setSelectedAllergens}
        />

        {/* Pulsanti di azione */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : "Salva"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
