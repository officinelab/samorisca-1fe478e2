
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PrintLayout } from "@/types/printLayout";

interface GeneralTabProps {
  layout: PrintLayout;
  onGeneralChange: (field: keyof PrintLayout, value: any) => void;
}

const GeneralTab = ({ layout, onGeneralChange }: GeneralTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="layout-name">Nome Layout</Label>
        <Input
          id="layout-name"
          value={layout.name}
          onChange={(e) => onGeneralChange("name", e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is-default"
          checked={layout.isDefault}
          onCheckedChange={(checked) => onGeneralChange("isDefault", Boolean(checked))}
        />
        <Label htmlFor="is-default">Layout predefinito</Label>
      </div>
    </div>
  );
};

export default GeneralTab;
