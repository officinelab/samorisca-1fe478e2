import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceInfo from "./sections/ProductPriceInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
              {/* Tenere SOLO questa occorrenza del titolo */}
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Nessun titolo duplicato qui */}
              <ProductBasicInfo form={form} />
              {/* Grid inline per Prezzo Standard e Suffisso Prezzo con toggle */}
              <div className="flex flex-wrap gap-4 items-end mt-6 mb-0">
                {/* Prezzo Standard compatto */}
                <FormField
                  control={form.control}
                  name="price_standard"
                  render={({ field }) => (
                    <FormItem className="flex flex-col" style={{ minWidth: 0 }}>
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
                {/* Testo Suffisso + Toggle sulla stessa linea */}
                <div className="flex items-end gap-2 flex-1 min-w-0">
                  {hasPriceSuffix && (
                    <FormField
                      control={form.control}
                      name="price_suffix"
                      render={({ field }) => (
                        <FormItem className="flex-1">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sezione Info Extra */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Info extra</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Grid due colonne: etichetta prodotto | prezzi multipli */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Colonna 1: Etichetta prodotto */}
                <div className="flex flex-col justify-center h-full">
                  <ProductLabelSelect form={form} labels={labels} />
                </div>
                {/* Colonna 2: Prezzi multipli (allineamento vert top, padding x match field height) */}
                <div className="flex flex-col justify-center h-full">
                  <div className="flex flex-row items-center h-[40px] md:h-full">
                    <FormField
                      control={form.control}
                      name="has_multiple_prices"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full min-h-[40px]">
                          <FormLabel className="font-medium">Prezzi multipli</FormLabel>
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
              </div>
              {/* Sezione Varianti Prezzo */}
              {hasMultiplePrices && (
                <div className="space-y-4 pl-0 border-l-0 mt-6">
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
              {/* Nessun titolo o descrizione sopra: solo voce espandibile */}
              <FeaturesSelector
                selectedFeatureIds={selectedFeatures}
                onChange={setSelectedFeatures}
              />
            </CardContent>
          </Card>

          {/* Allergeni */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              {/* Solo voce espandibile */}
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
