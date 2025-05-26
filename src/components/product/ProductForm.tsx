
import React from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";

// Section Components
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceInfo from "./sections/ProductPriceInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
// Feature and Allergen Selectors
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
        {/* --- Stato Attivo in alto --- */}
        <div className="mb-6 rounded-lg border bg-muted/50 px-4 py-3 flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-base">Stato Attivo</span>
            <span className="ml-1 text-muted-foreground text-base font-normal">
              Mostra questo prodotto nel menu
            </span>
          </div>
          <div className="flex-shrink-0 ml-4">
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
        </div>

        {/* --- Layout 2 colonne per la parte base --- */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Colonna sinistra: Immagine Prodotto */}
          <div className="md:w-1/3 w-full">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">
                    Immagine Prodotto
                  </FormLabel>
                  <FormControl>
                    <div className="rounded-xl border bg-background p-4 flex items-center justify-center min-h-[170px]">
                      <ImageUploader
                        currentImage={field.value || ""}
                        onImageUploaded={(url) => field.onChange(url)}
                        label=""
                        bucketName="products"
                        id="product-image-upload"
                        // Nessuna X duplicata: la X di ImageUploader è già presente,
                        // viene automaticamente ridimensionata per la UI (v. codice ImageUploader).
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Colonna destra: Nome prodotto e Descrizione */}
          <div className="flex-1 flex flex-col gap-4">
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
          </div>
        </div>

        {/* --- Altre sezioni modulo --- */}
        <ProductLabelSelect form={form} labels={labels} />
        <ProductPriceInfo 
          form={form} 
          hasPriceSuffix={hasPriceSuffix}
          hasMultiplePrices={hasMultiplePrices}
        />
        <FeaturesSelector
          selectedFeatureIds={selectedFeatures}
          onChange={setSelectedFeatures}
        />
        <AllergenSelector
          selectedAllergenIds={selectedAllergens}
          onChange={setSelectedAllergens}
        />
        <ProductActionButtons
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
};

export default ProductForm;
