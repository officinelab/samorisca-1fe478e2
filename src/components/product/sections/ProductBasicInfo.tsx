
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

/**
 * Layout UI sulla base della reference image:
 * - "Stato Attivo" in un box chiaro in alto, switch a destra, descrizione accanto a sinistra
 * - Sotto: layout responsive. Desktop = due colonne, mobile = stack verticale
 *   - Sinistra: Immagine in box quadrato, bottone X in alto a destra
 *   - Destra: Nome prodotto (Input), sotto Descrizione (Textarea)
 *   - Sotto (full): Prezzo Standard, Suffisso prezzo (switch+input). 
 */

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormValues>;
  hasPriceSuffix: boolean;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ form, hasPriceSuffix }) => {
  return (
    <div className="w-full">
      {/* Stato Attivo */}
      <div className="bg-muted/40 rounded-lg px-6 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between w-full gap-4 mb-0">
                <div className="flex flex-col">
                  <FormLabel className="text-base font-semibold mb-0">Stato Attivo</FormLabel>
                  <FormDescription className="text-base text-muted-foreground mb-0">
                    Mostra questo prodotto nel menu
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-75 ml-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Immagine + Nome/Descrizione - Layout responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Colonna sx: Immagine Prodotto - occupa 35% invece di 25% */}
        <div className="md:col-span-4 md:w-[35%] col-span-1">
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
                      label=""
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
        <div className="flex flex-col gap-5 md:col-span-8 md:w-[65%] col-span-1">
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

      {/* Prezzo Standard + Suffisso prezzo dentro Informazioni di Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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
                  className="scale-95"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Testo Suffisso (condizionale) - full width */}
      {hasPriceSuffix && (
        <FormField
          control={form.control}
          name="price_suffix"
          render={({ field }) => (
            <FormItem className="mt-4">
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
    </div>
  );
};

export default ProductBasicInfo;
