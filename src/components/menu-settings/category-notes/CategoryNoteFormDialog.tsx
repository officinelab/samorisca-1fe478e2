
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryNoteFormData, CategoryNote } from "@/types/categoryNotes";
import { Category } from "@/types/database";
import { CategorySelector } from "./CategorySelector";
import { CategoryNoteImageUploader } from "./CategoryNoteImageUploader";
import { CategoryNoteFormFields } from "./CategoryNoteFormFields";

interface CategoryNoteFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ((data: CategoryNoteFormData) => Promise<any>) | ((id: string, data: CategoryNoteFormData) => Promise<any>);
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
  const currentIconUrl = watch("icon_url");

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
      if (initialData) {
        await (onSubmit as (id: string, data: CategoryNoteFormData) => Promise<any>)(initialData.id, data);
      } else {
        await (onSubmit as (data: CategoryNoteFormData) => Promise<any>)(data);
      }
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

  const handleImageUploaded = (url: string) => {
    setValue("icon_url", url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>
            {initialData ? "Modifica Nota" : "Nuova Nota"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full flex flex-col">
            <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryNoteFormFields register={register} errors={errors} />
                
                <CategoryNoteImageUploader
                  currentIconUrl={currentIconUrl}
                  onImageUploaded={handleImageUploaded}
                />

                <CategorySelector
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>

            <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || selectedCategories.length === 0}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Salvataggio..." : initialData ? "Aggiorna" : "Crea"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
