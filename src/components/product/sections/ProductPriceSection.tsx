
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ProductLabelSelect from "./ProductLabelSelect";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/form";
import { ProductLabel } from "@/types/database";

/**
 * Props: tutti dati necessari per mostrare l'intera sezione prezzo
 */
interface ProductPriceSectionProps {
  form: UseFormReturn<ProductFormValues>;
  labels: ProductLabel[];
  hasPriceSuffix: boolean;
  hasMultiplePrices: boolean;
}

const ProductPriceSection: React.FC<ProductPriceSectionProps> = ({
  form,
  labels,
  hasPriceSuffix,
  hasMultiplePrices,
}) => {
  return (
    <>
      {/* Riga: Etichetta prodotto | Prezzo Standard | (Suffisso prezzo se attivo) */}
      {!hasPriceSuffix ? (
        <div className="flex flex-col md:flex-row gap-4 mt-6 mb-0">
          {/* Colonna 1: Etichetta prodotto */}
          <div className="flex-1 min-w-0">
            <ProductLabelSelect form={form} labels={labels} />
          </div>
          {/* Colonna 2: Prezzo Standard */}
          <div className="flex-1 min-w-0">
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 mt-6 mb-0">
          {/* Colonna 1: Etichetta prodotto */}
          <div className="w-full md:w-[36%] min-w-0">
            <ProductLabelSelect form={form} labels={labels} />
          </div>
          {/* Colonna 2: Prezzo Standard */}
          <div className="w-full md:w-[32%] min-w-0">
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
          </div>
          {/* Colonna 3: Suffisso prezzo */}
          <div className="w-full md:w-[32%] min-w-0">
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
        </div>
      )}

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
    </>
  );
};

export default ProductPriceSection;
