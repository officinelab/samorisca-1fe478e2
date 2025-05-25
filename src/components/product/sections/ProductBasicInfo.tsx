import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/form";

/**
 * Layout UI sulla base della reference image:
 * - "Stato Attivo" in linea col titolo "Informazioni di Base"
 * - Sotto: layout responsive. Desktop = due colonne, mobile = stack verticale
 *   - Sinistra: Immagine in box quadrato, bottone X in alto a destra
 *   - Destra: Nome prodotto (Input), sotto Descrizione (Textarea)
 */

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ form }) => {
  return (
    <div className="w-full">
      {/* Immagine + Nome/Descrizione - Layout responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Colonna sx: Immagine Prodotto */}
        <div className="md:col-span-4 col-span-1">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Immagine Prodotto</FormLabel>
                <div className="mt-2 relative">
                  <div className="relative">
                    <ImageUploader
                      currentImage={field.value || ""}
                      onImageUploaded={(url) => { field.onChange(url); }}
                      label="Carica immagine del prodotto"
                      bucketName="menu-images"
                      folderPath="menu"
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Colonna dx: Nome prodotto sopra, Descrizione sotto */}
        <div className="flex flex-col gap-5 md:col-span-8 col-span-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Nome Prodotto</FormLabel>
                <FormControl>
                  <Input placeholder="Nome del prodotto" {...field} />
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
                <FormLabel className="text-base font-semibold">Descrizione</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descrizione del prodotto"
                    className="min-h-28"
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
    </div>
  );
};

export default ProductBasicInfo;
