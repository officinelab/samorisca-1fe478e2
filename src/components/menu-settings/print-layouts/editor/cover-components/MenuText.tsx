
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MenuTextProps {
  menuTitle: string;
  menuSubtitle: string;
  onMenuTitleChange?: (value: string) => void;
  onMenuSubtitleChange?: (value: string) => void;
}

const MenuText: React.FC<MenuTextProps> = ({
  menuTitle,
  menuSubtitle,
  onMenuTitleChange,
  onMenuSubtitleChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h4 className="text-lg font-medium mb-4">Testo Copertina</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Titolo del Menu</Label>
            <Input
              value={menuTitle}
              onChange={(e) => onMenuTitleChange && onMenuTitleChange(e.target.value)}
              placeholder="Titolo del Menu"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sottotitolo del Menu</Label>
            <Input
              value={menuSubtitle}
              onChange={(e) => onMenuSubtitleChange && onMenuSubtitleChange(e.target.value)}
              placeholder="Sottotitolo del Menu"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuText;
