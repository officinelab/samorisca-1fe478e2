
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Category } from "@/types/database";
import { Folder, FileText, Eye, EyeOff } from "lucide-react";

const categoryFormSchema = z.object({
  title: z.string().min(1, "Il nome è obbligatorio"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSave,
  onCancel
}) => {
  const isEditing = Boolean(category);
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: category?.title || "",
      description: category?.description || "",
      is_active: category?.is_active ?? true,
    },
  });
  
  const onSubmit = async (values: CategoryFormData) => {
    await onSave(values);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center border-b border-gray-100 pb-6">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
          <Folder className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Modifica Categoria" : "Nuova Categoria"}
        </h2>
        <p className="text-gray-600 mt-2">
          {isEditing 
            ? "Aggiorna le informazioni della categoria" 
            : "Crea una nuova categoria per organizzare i tuoi prodotti"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informazioni Base */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Informazioni Base</h3>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-900">
                    Nome Categoria *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Es. Antipasti, Primi Piatti, Dolci..." 
                      className="h-12 text-base border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormMessage className="text-error-600" />
                </FormItem>
              )}
            />
            
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
                      {...field} 
                      placeholder="Aggiungi una descrizione opzionale per questa categoria..."
                      value={field.value || ""}
                      rows={4}
                      className="text-base border-gray-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    La descrizione aiuta a identificare meglio la categoria (opzionale).
                  </FormDescription>
                  <FormMessage className="text-error-600" />
                </FormItem>
              )}
            />
          </div>

          {/* Impostazioni Visibilità */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Visibilità</h3>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-gray-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {field.value ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      )}
                      <FormLabel className="text-base font-medium text-gray-900">
                        Categoria Attiva
                      </FormLabel>
                    </div>
                    <FormDescription className="text-gray-600">
                      {field.value 
                        ? "La categoria è visibile nel menu pubblico" 
                        : "La categoria è nascosta dal menu pubblico"}
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
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="px-8 py-3 h-auto border-gray-300 hover:bg-gray-50"
            >
              Annulla
            </Button>
            <Button 
              type="submit"
              className="px-8 py-3 h-auto bg-primary-600 hover:bg-primary-700"
            >
              {isEditing ? "Aggiorna Categoria" : "Crea Categoria"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
