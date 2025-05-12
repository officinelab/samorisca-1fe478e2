
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoriesOptionsProps {
  categories: Category[];
  selectedCategories: string[];
  onToggle: (categoryId: string) => void;
  onToggleAll: () => void;
  isLoading: boolean;
}

export const CategoriesOptions = ({
  categories,
  selectedCategories,
  onToggle,
  onToggleAll,
  isLoading
}: CategoriesOptionsProps) => {
  // Check if all categories are selected
  const allSelected = categories.length > 0 && selectedCategories.length === categories.length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="select-all" className="text-sm font-medium">
          Seleziona/Deseleziona tutte
        </Label>
        <Checkbox 
          id="select-all"
          checked={allSelected}
          onCheckedChange={() => onToggleAll()}
          disabled={isLoading || categories.length === 0}
        />
      </div>

      <div className="border rounded-md">
        {categories.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {isLoading ? "Caricamento categorie..." : "Nessuna categoria disponibile"}
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-3">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <Label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.title}
                  </Label>
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => onToggle(category.id)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

// Add a default export as well
export default CategoriesOptions;
