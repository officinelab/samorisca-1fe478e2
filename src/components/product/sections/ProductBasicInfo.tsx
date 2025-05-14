
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const ProductBasicInfo = ({ form }) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome prodotto</FormLabel>
            <FormControl>
              <Input placeholder="Inserisci il nome" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrizione</FormLabel>
            <FormControl>
              <Textarea placeholder="Descrizione (opzionale)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Is Active Switch */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center space-x-2">
              <span>Disponibile</span>
              <Switch
                checked={!!field.value}
                onCheckedChange={(val) => {
                  // Defensive check for Switch value, always use boolean!
                  form.setValue("is_active", Boolean(val), { shouldDirty: true });
                }}
                // Forward field ref for React Hook Form
                ref={field.ref}
              />
            </FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductBasicInfo;

