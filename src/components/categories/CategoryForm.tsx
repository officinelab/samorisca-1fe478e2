
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/database";
import { toast } from "sonner";

const categorySchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSave?: () => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        title: category.title || "",
        description: category.description || "",
        is_active: category.is_active,
      });
    }
  }, [category, form]);

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update(data)
          .eq("id", category.id);

        if (error) throw error;
        toast.success("Categoria aggiornata con successo");
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert([data]);

        if (error) throw error;
        toast.success("Categoria creata con successo");
      }

      onSave?.();
    } catch (error) {
      console.error("Errore nel salvare la categoria:", error);
      toast.error("Errore nel salvare la categoria");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo *</FormLabel>
              <FormControl>
                <Input placeholder="Nome della categoria" {...field} />
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
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione della categoria (opzionale)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Categoria attiva</FormLabel>
                <div className="text-sm text-muted-foreground">
                  La categoria sarà visibile nel menu pubblico
                </div>
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

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annulla
            </Button>
          )}
          <Button type="submit">
            {category ? "Aggiorna" : "Crea"} Categoria
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
