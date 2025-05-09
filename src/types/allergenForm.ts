
import { z } from "zod";

// Schema per la validazione degli allergeni nel form
export const allergenFormSchema = z.object({
  number: z.number().int().positive("Il numero deve essere positivo").optional(),
  title: z.string().min(1, "Il titolo è obbligatorio"),
  description: z.string().optional().nullable(),
  icon_url: z.string().optional().nullable(),
});

export type AllergenFormValues = z.infer<typeof allergenFormSchema>;

// Funzione di utilità per convertire un allergene dal DB al formato del form
export const allergenToFormValues = (allergen: any): AllergenFormValues => {
  return {
    number: allergen.number || undefined,
    title: allergen.title || "",
    description: allergen.description || "",
    icon_url: allergen.icon_url || "",
  };
};
