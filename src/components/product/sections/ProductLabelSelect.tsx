
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/form";
import { ProductLabel } from "@/types/database";

interface ProductLabelSelectProps {
  form: UseFormReturn<ProductFormValues>;
  labels: ProductLabel[];
}

const ProductLabelSelect: React.FC<ProductLabelSelectProps> = ({ form, labels }) => {
  return (
    <FormField
      control={form.control}
      name="label_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Etichetta prodotto</FormLabel>
          <Select
            value={field.value || "none"}
            onValueChange={val => field.onChange(val === "none" ? null : val)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un'etichetta" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Nessuna etichetta</SelectItem>
              {Array.isArray(labels) && labels.map((label) => (
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
  );
};

export default ProductLabelSelect;
