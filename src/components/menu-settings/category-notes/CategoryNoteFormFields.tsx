
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryNoteFormData } from "@/types/categoryNotes";

interface CategoryNoteFormFieldsProps {
  register: UseFormRegister<CategoryNoteFormData>;
  errors: FieldErrors<CategoryNoteFormData>;
}

export const CategoryNoteFormFields: React.FC<CategoryNoteFormFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <>
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
    </>
  );
};
