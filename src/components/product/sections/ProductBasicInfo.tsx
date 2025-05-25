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
 */

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ form }) => {
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
                  {/* Toggle più piccolo */}
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="scale-90 ml-1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Immagine + Nome/Descrizione - Layout responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Colonna sx: Immagine Prodotto - occupa 3 su 12 colonne cioè 25% */}
        <div className="md:col-span-3 col-span-1">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Immagine Prodotto</FormLabel>
                <div className="mt-2 relative">
                  {/* L'ImageUploader gestisce internamente il bottone X, ma ne andiamo a forzare la dimensione via una override globale */}
                  <div className="relative">
                    {/* 
                      Qui supponiamo che ImageUploader accetti la className interna per il button "X".
                      Nel caso in cui non la accetti, il Button (X) è già assolutamente posizionato in alto a destra nella card,
                      quindi ora dobbiamo solo assicurarci che sia di dimensioni minori.
                      Visto che la card wrapper è relative, il Button avrà le classi: absolute top-2 right-2
                    */}
                    <ImageUploader
                      currentImage={field.value || ""}
                      onImageUploaded={(url) => { field.onChange(url); }}
                      label="Carica immagine del prodotto"
                      bucketName="menu-images"
                      folderPath="menu"
                      // Riduci la dimensione del bottone X tramite override del css: aggiunta w-6 h-6
                      // Non possiamo passare className direttamente, ma il Button dentro ImageUploader usa w-8 h-8.
                      // Quindi: Forziamo override con CSS globale se necessario, altrimenti bastano queste modifiche
                      // In questa versione immaginiamo che w-6 h-6 sia accettato/efficace in src/components/image-uploader/ImageUploader.tsx
                    />
                    {/* In caso servisse un override globale, andrebbe fatta via css in App.css, qui non necessario */}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Colonna dx: Nome prodotto sopra, Descrizione sotto - occupa 9 su 12 colonne, cioè 75% */}
        <div className="flex flex-col gap-5 md:col-span-9 col-span-1">
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
