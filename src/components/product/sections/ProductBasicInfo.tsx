
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
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
    <section>
      <h2 className="text-2xl font-semibold mb-2">Informazioni di Base</h2>

      {/* Box Stato Attivo - full row box con bordo e bg chiaro */}
      <div className="mb-4 rounded-lg border bg-muted/50 px-4 py-3 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-base">Stato Attivo</span>
          <span className="ml-1 text-muted-foreground text-base font-normal">
            Mostra questo prodotto nel menu
          </span>
        </div>
        <div className="flex-shrink-0 ml-4">
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="m-0 p-0 border-0 shadow-none">
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

      {/* Responsive two-column layout */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Colonna sinistra: Image */}
        <div className="md:w-1/3 w-full">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Immagine Prodotto
                </FormLabel>
                <FormControl>
                  <div className="rounded-xl border bg-background p-4 flex items-center justify-center min-h-[170px]">
                    <ImageUploader
                      currentImage={field.value || ""}
                      onImageUploaded={(url) => field.onChange(url)}
                      label=""
                      bucketName="products"
                      // Riduci la "X" di rimozione via css qui sotto
                      id="product-image-upload"
                      // Stili già presenti
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Colonna destra: Nome prodotto e Descrizione */}
        <div className="flex-1 flex flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Nome Prodotto
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome del prodotto"
                    {...field}
                    className="font-normal text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Descrizione
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrizione del prodotto"
                    className="min-h-32 font-normal text-base"
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
    </section>
  );
};

export default ProductBasicInfo;
