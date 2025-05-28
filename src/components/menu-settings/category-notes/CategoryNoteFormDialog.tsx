
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUploader } from "@/components/ImageUploader";
import { CategoryNoteFormData, CategoryNote } from "@/types/categoryNotes";
import { Category } from "@/types/database";

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
        // Update case - pass ID as first parameter
        await (onSubmit as (id: string, data: CategoryNoteFormData) => Promise<any>)(initialData.id, data);
      } else {
        // Create case - pass only data
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
                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
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

                <div className="md:col-span-1">
                  <Label>Icona</Label>
                  <div className="max-w-[120px]">
                    <ImageUploader
                      onImageUploaded={handleImageUploaded}
                      currentImage={currentIconUrl}
                      bucketName="category-note-icons"
                      folderPath="icons"
                      label="Carica icona"
                      maxSizeInMB={2}
                      allowedTypes={["image/jpeg", "image/png", "image/webp", "image/svg+xml"]}
                      id="category-note-icon"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-base font-medium">Categorie *</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Seleziona le categorie in cui mostrare questa nota
                  </p>
                  <div className="border rounded-md bg-gray-50">
                    <ScrollArea className="h-40 p-3">
                      <div className="space-y-2">
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
                    </ScrollArea>
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Seleziona almeno una categoria
                    </p>
                  )}
                </div>
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
