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
  onlyVariants?: boolean; // aggiungi prop opzionale
}

const ProductPriceInfo: React.FC<ProductPriceInfoProps> = ({ 
  form, 
  hasPriceSuffix, 
  hasMultiplePrices,
  onlyVariants = false
}) => {
  if(onlyVariants) {
    // Rendi solo le varianti quando onlyVariants è true
    return (
      <div className="space-y-4 pl-4 border-l-2 border-muted">
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
    )
  }

  // Versione normale, che non dovrebbe essere più mostrata ora, ma la lasciamo per compatibilità
  return null;
};

export default ProductPriceInfo;
