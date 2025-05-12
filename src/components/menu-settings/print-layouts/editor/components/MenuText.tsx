
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PrintLayoutElementConfig } from "@/types/printLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ElementEditor from "../../ElementEditor";

interface MenuTextProps {
  element: PrintLayoutElementConfig;
  title: string;
  onChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onMarginChange: (field: keyof PrintLayoutElementConfig['margin'], value: number) => void;
}

const MenuText: React.FC<MenuTextProps> = ({
  element,
  title,
  onChange,
  onMarginChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h4 className="text-lg font-medium mb-4">{title}</h4>
        
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label>Testo personalizzato</Label>
            <Input 
              type="text"
              value={element.text || ''}
              onChange={(e) => onChange('text', e.target.value)}
              placeholder={title === "Titolo Menu" ? "Menu" : "Ristorante"}
            />
          </div>
        </div>
        
        <ElementEditor
          element={element}
          onChange={onChange}
          onMarginChange={onMarginChange}
        />
      </CardContent>
    </Card>
  );
};

export default MenuText;
