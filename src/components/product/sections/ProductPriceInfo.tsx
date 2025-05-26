
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
}

const ProductPriceInfo: React.FC<ProductPriceInfoProps> = ({ 
  form, 
  hasPriceSuffix, 
  hasMultiplePrices 
}) => {
  return (
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
  );
};

export default ProductPriceInfo;
