
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/database";

interface CategoriesOptionsProps {
  categories: Category[];
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  handleToggleAllCategories: () => void;
}

export const CategoriesOptions = ({
  categories,
  selectedCategories,
  handleCategoryToggle,
  handleToggleAllCategories,
}: CategoriesOptionsProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="select-all" className="text-sm font-medium">Seleziona/Deseleziona tutte</Label>
        <Checkbox 
          id="select-all"
          checked={selectedCategories.length === categories.length}
          onCheckedChange={handleToggleAllCategories}
        />
      </div>

      <div className="border rounded-md p-3">
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between">
              <Label htmlFor={`category-${category.id}`} className="text-sm">{category.title}</Label>
              <Checkbox 
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
