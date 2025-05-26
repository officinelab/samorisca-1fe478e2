
import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";

import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceInfo from "./sections/ProductPriceInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";

interface ProductFormProps {
  product?: Product;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit
  } = useProductForm(product, onSave);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* Nome prodotto */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                Nome Prodotto
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome del prodotto"
                  {...field}
                  className="font-normal text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Box "Stato Attivo" */}
        <div className="rounded-lg border bg-muted/50 px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-base">Attivo</span>
            <span className="text-muted-foreground text-base font-normal">Mostra questo prodotto nel menu</span>
          </div>
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="m-0 p-0 border-0 shadow-none">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Descrizione */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                Descrizione
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrizione del prodotto"
                  className="min-h-32 font-normal text-base"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features (Caratteristiche) */}
        <FeaturesSelector
          selectedFeatureIds={selectedFeatures}
          onChange={setSelectedFeatures}
        />

        {/* Immagine Prodotto */}
        <div>
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Immagine Prodotto
                </FormLabel>
                <FormControl>
                  <div className="rounded-xl border bg-background p-2 flex flex-col items-center justify-center">
                    <ImageUploader
                      currentImage={field.value || ""}
                      onImageUploaded={(url) => field.onChange(url)}
                      label="Carica immagine"
                      bucketName="products"
                      id="product-image-upload"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Etichetta prodotto */}
        <ProductLabelSelect form={form} labels={labels} />

        {/* Info prezzi */}
        <ProductPriceInfo 
          form={form} 
          hasPriceSuffix={hasPriceSuffix}
          hasMultiplePrices={hasMultiplePrices}
        />

        {/* Allergeni */}
        <AllergenSelector
          selectedAllergenIds={selectedAllergens}
          onChange={setSelectedAllergens}
        />

        {/* Pulsanti azione */}
        <ProductActionButtons
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />

      </form>
    </Form>
  );
};

export default ProductForm;
