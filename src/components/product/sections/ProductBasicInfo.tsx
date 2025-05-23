
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/types/form";
import { Package, FileText, Image, Eye, EyeOff } from "lucide-react";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ form }) => {
  const isActive = form.watch("is_active");

  return (
    <div className="space-y-8">
      {/* Header Sezione */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Informazioni Prodotto</h3>
          <p className="text-sm text-gray-600">Aggiungi le informazioni base del prodotto</p>
        </div>
      </div>

      {/* Nome Prodotto */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nome Prodotto *
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Es. Spaghetti alla Carbonara, Tiramisù della casa..." 
                {...field} 
                className="h-12 text-base border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </FormControl>
            <FormMessage className="text-error-600" />
          </FormItem>
        )}
      />

      {/* Stato Attivo */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-gray-50/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isActive ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
                <FormLabel className="text-base font-medium text-gray-900">
                  Prodotto Disponibile
                </FormLabel>
              </div>
              <FormDescription className="text-gray-600">
                {isActive 
                  ? "Il prodotto è visibile e ordinabile nel menu" 
                  : "Il prodotto è nascosto dal menu pubblico"}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary-600"
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
            <FormLabel className="text-base font-medium text-gray-900">
              Descrizione
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descrivi gli ingredienti, la preparazione o le caratteristiche speciali del prodotto..."
                className="min-h-32 text-base border-gray-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              Una buona descrizione aiuta i clienti a scegliere il prodotto giusto.
            </FormDescription>
            <FormMessage className="text-error-600" />
          </FormItem>
        )}
      />

      {/* Immagine Prodotto */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-gray-600" />
          <FormLabel className="text-base font-medium text-gray-900">
            Immagine Prodotto
          </FormLabel>
        </div>
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
                  <ImageUploader
                    currentImage={field.value || ""}
                    onImageUploaded={(url) => {
                      field.onChange(url);
                    }}
                    label="Carica o trascina un'immagine"
                    bucketName="products"
                  />
                </div>
              </FormControl>
              <FormDescription className="text-gray-500">
                Dimensioni consigliate: 800x600px. Formati supportati: JPG, PNG, WebP.
              </FormDescription>
              <FormMessage className="text-error-600" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProductBasicInfo;
