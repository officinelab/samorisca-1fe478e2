
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/form";

interface ProductPriceInfoProps {
  form: UseFormReturn<ProductFormValues>;
  hasPriceSuffix: boolean;
  hasMultiplePrices: boolean;
  showStandardPrice?: boolean;
  showPriceSuffix?: boolean;
  onlyMultiplePrices?: boolean;
}

const ProductPriceInfo: React.FC<ProductPriceInfoProps> = ({
  form,
  hasPriceSuffix,
  hasMultiplePrices,
  showStandardPrice = false,
  showPriceSuffix = false,
  onlyMultiplePrices = false
}) => {
  // Solo prezzi multipli e varianti (per sezione Extra Info)
  if (onlyMultiplePrices) {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="has_multiple_prices"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Prezzi multipli</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {hasMultiplePrices && (
          <div className="space-y-4 border-l-2 border-muted pl-4">
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
      </div>
    );
  }

  // Solo standard price
  return (
    <>
      {showStandardPrice && (
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
      )}
      {/* Switch suffisso prezzo */}
      {showPriceSuffix && (
        <>
          <FormField
            control={form.control}
            name="has_price_suffix"
            render={({ field }) => (
              <div className="flex items-center gap-3 mt-2 mb-2">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="scale-75"
                />
                <span className="text-sm">Suffisso prezzo</span>
              </div>
            )}
          />
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
        </>
      )}
    </>
  );
};

export default ProductPriceInfo;
