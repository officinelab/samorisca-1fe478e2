
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/form";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ form }) => {
  return (
    <>
      {/* Nome Prodotto */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Prodotto</FormLabel>
            <FormControl>
              <Input placeholder="Nome del prodotto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stato Attivo */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Stato Attivo</FormLabel>
              <FormDescription>
                Mostra questo prodotto nel menu
              </FormDescription>
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

      {/* Descrizione */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrizione</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descrizione del prodotto"
                className="min-h-32"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Immagine Prodotto */}
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Immagine Prodotto</FormLabel>
            <FormControl>
              <ImageUploader
                currentImage={field.value || ""}
                onImageUploaded={(url) => {
                  field.onChange(url);
                }}
                label="Carica immagine del prodotto"
                bucketName="products"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductBasicInfo;
