
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
import { X } from "lucide-react";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ form }) => {
  // Gestione reset immagine: azzera il valore campo immagine
  const removeImage = () => {
    form.setValue("image_url", "");
  };

  return (
    <div className="space-y-4">
      {/* Stato Attivo */}
      <div className="rounded-xl border px-6 py-4 flex flex-col md:flex-row md:items-center gap-3 bg-muted/50">
        <div className="flex items-center flex-1 min-w-0 space-x-2">
          <span className="font-semibold text-base">
            Stato Attivo
          </span>
          <span className="text-sm text-muted-foreground">
            Mostra questo prodotto nel menu
          </span>
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center md:justify-end">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Stato Attivo"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Immagine, Nome, Descrizione */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0">
        {/* Immagine prodotto con anteprima e rimozione */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">Immagine Prodotto</FormLabel>
              <div className="relative mt-2 w-44 h-44 flex justify-center items-center rounded-xl border bg-background">
                {/* Anteprima immagine caricata oppure placeholder */}
                <ImageUploader
                  currentImage={field.value || ""}
                  onImageUploaded={(url) => {
                    field.onChange(url);
                  }}
                  label="Carica immagine del prodotto"
                  bucketName="menu-images"
                  folderPath="menu"
                  className="w-full h-full object-cover rounded-xl"
                />
                {!!field.value && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10"
                    tabIndex={-1}
                    aria-label="Rimuovi immagine"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nome e descrizione, disposti in verticale */}
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">Nome Prodotto</FormLabel>
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
                <FormLabel className="font-semibold text-base">Descrizione</FormLabel>
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
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
