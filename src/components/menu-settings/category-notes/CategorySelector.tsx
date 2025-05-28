
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types/database";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
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
                    onCategoryChange(category.id, checked as boolean)
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
  );
};
