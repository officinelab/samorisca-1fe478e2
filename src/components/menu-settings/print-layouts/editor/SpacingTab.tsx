
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrintLayout } from "@/types/printLayout";

interface SpacingTabProps {
  layout: PrintLayout;
  onSpacingChange: (field: keyof PrintLayout["spacing"], value: number) => void;
}

const SpacingTab = ({ layout, onSpacingChange }: SpacingTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="between-categories">Spazio tra categorie (mm)</Label>
        <Input
          id="between-categories"
          type="number"
          min={0}
          value={layout.spacing.betweenCategories}
          onChange={(e) => onSpacingChange("betweenCategories", parseInt(e.target.value))}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="between-products">Spazio tra prodotti (mm)</Label>
        <Input
          id="between-products"
          type="number"
          min={0}
          value={layout.spacing.betweenProducts}
          onChange={(e) => onSpacingChange("betweenProducts", parseInt(e.target.value))}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="category-margin">Margine inferiore titolo categoria (mm)</Label>
        <Input
          id="category-margin"
          type="number"
          min={0}
          value={layout.spacing.categoryTitleBottomMargin}
          onChange={(e) => onSpacingChange("categoryTitleBottomMargin", parseInt(e.target.value))}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default SpacingTab;
