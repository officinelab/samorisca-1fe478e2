
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
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductBasicInfo form={form} />

              {/* Prezzo Standard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-0">
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

                {/* Suffisso Prezzo Switch */}
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
              </div>
              {/* Testo Suffisso (solo se attivo) */}
              {hasPriceSuffix && (
                <div className="mt-2">
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sezione Info Extra */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Info extra</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Etichetta Prodotto */}
              <ProductLabelSelect form={form} labels={labels} />
              <Separator className="my-4" />
              {/* Prezzi Multipli e Varianti */}
              {/* Solo la parte dei prezzi multipli e varianti prezzo */}
              <div className="mb-2">
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
              </div>
              {/* Varianti Prezzo (solo se attivo) */}
              {hasMultiplePrices && (
                <div className="space-y-4 pl-4 border-l-2 border-muted mt-2">
                  <h4 className="text-md font-medium">Varianti di prezzo</h4>
                  {/* Variante 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          {/* Caratteristiche */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Caratteristiche</CardTitle>
              <span className="text-xs text-muted-foreground mt-0">
                Specifica le feature opzionali per questo prodotto
              </span>
            </CardHeader>
            <CardContent>
              <FeaturesSelector
                selectedFeatureIds={selectedFeatures}
                onChange={setSelectedFeatures}
              />
            </CardContent>
          </Card>

          {/* Allergeni */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allergeni</CardTitle>
              <span className="text-xs text-muted-foreground mt-0">
                Seleziona gli allergeni presenti nel prodotto
              </span>
            </CardHeader>
            <CardContent>
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
