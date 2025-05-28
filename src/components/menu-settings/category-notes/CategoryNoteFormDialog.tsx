
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CategoryNoteFormData, CategoryNote } from "@/types/categoryNotes";
import { Category } from "@/types/database";

interface CategoryNoteFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryNoteFormData) => Promise<any>;
  categories: Category[];
  initialData?: CategoryNote | null;
}

export const CategoryNoteFormDialog: React.FC<CategoryNoteFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryNoteFormData>({
    defaultValues: {
      title: "",
      text: "",
      icon_url: "",
      categories: [],
    },
  });

  const selectedCategories = watch("categories") || [];

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          title: initialData.title,
          text: initialData.text,
          icon_url: initialData.icon_url || "",
          categories: initialData.categories || [],
        });
      } else {
        reset({
          title: "",
          text: "",
          icon_url: "",
          categories: [],
        });
      }
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: CategoryNoteFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = selectedCategories;
    if (checked) {
      setValue("categories", [...currentCategories, categoryId]);
    } else {
      setValue("categories", currentCategories.filter(id => id !== categoryId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifica Nota" : "Nuova Nota"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titolo *</Label>
            <Input
              id="title"
              {...register("title", { required: "Il titolo è obbligatorio" })}
              placeholder="Inserisci il titolo"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="text">Testo *</Label>
            <Textarea
              id="text"
              {...register("text", { required: "Il testo è obbligatorio" })}
              placeholder="Inserisci il testo della nota"
              rows={3}
            />
            {errors.text && (
              <p className="text-sm text-red-500 mt-1">{errors.text.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="icon_url">URL Icona</Label>
            <Input
              id="icon_url"
              {...register("icon_url")}
              placeholder="https://esempio.com/icona.png"
            />
          </div>

          <div>
            <Label className="text-base font-medium">Categorie *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Seleziona le categorie in cui mostrare questa nota
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.title}
                  </Label>
                </div>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                Seleziona almeno una categoria
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedCategories.length === 0}
            >
              {isSubmitting ? "Salvataggio..." : initialData ? "Aggiorna" : "Crea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
