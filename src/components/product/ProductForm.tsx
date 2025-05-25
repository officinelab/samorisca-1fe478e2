
import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ProductLabelSelect from "./sections/ProductLabelSelect";

interface ProductFormProps {
  product?: Product;
  categoryId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categoryId,
  onSave,
  onCancel,
}) => {
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
    handleSubmit,
  } = useProductForm(product, categoryId, onSave);

  return (
    <div className="px-0 py-4 md:px-6 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* Informazioni Base */}
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductBasicInfo form={form} />

              {/* Riga: Etichetta prodotto | Prezzo Standard | (Suffisso prezzo se attivo) */}
              <div className="flex flex-row justify-end items-end gap-4 mt-6 mb-0 flex-wrap">
                {/* Colonna 1: Etichetta prodotto */}
                <div className="w-full md:w-auto md:min-w-[160px] max-w-xs flex-1">
                  <ProductLabelSelect form={form} labels={labels} />
                </div>
                {/* Colonna 2: Prezzo Standard */}
                <FormField
                  control={form.control}
                  name="price_standard"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-w-[120px] max-w-[140px]">
                      <FormLabel>Prezzo Standard</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="max-w-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Colonna 3: Suffisso prezzo (solo se attivo) */}
                {hasPriceSuffix && (
                  <FormField
                    control={form.control}
                    name="price_suffix"
                    render={({ field }) => (
                      <FormItem className="min-w-[140px] flex-1">
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
              </div>
              {/* RIGA 2: Toggle Suffix + Toggle Prezzi multipli */}
              <div className="flex flex-row justify-end gap-4 mt-3 flex-wrap">
                <FormField
                  control={form.control}
                  name="has_price_suffix"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between m-0 p-0 border-0 shadow-none gap-1 h-[38px]">
                      <FormLabel className="mb-0">Suffisso prezzo</FormLabel>
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
                  name="has_multiple_prices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between m-0 p-0 border-0 shadow-none gap-1 h-[38px]">
                      <FormLabel className="mb-0">Prezzi multipli</FormLabel>
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
              {/* Varianti Prezzo (solo se prezzi multipli attivi) */}
              {hasMultiplePrices && (
                <div className="space-y-4 pl-0 border-l-0 mt-4">
                  <h4 className="text-md font-medium mb-2">Varianti di prezzo</h4>
                  {/* Variante 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Col 1: Prezzo Variante */}
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
                    {/* Col 2: Nome Variante */}
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
                  </div>
                  {/* Variante 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Col 1: Prezzo Variante */}
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
                    {/* Col 2: Nome Variante */}
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
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Caratteristiche */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <FeaturesSelector
                selectedFeatureIds={selectedFeatures}
                onChange={setSelectedFeatures}
              />
            </CardContent>
          </Card>

          {/* Allergeni */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <AllergenSelector
                selectedAllergenIds={selectedAllergens}
                onChange={setSelectedAllergens}
              />
            </CardContent>
          </Card>

          {/* Azioni */}
          <Separator className="my-4" />
          <ProductActionButtons
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
