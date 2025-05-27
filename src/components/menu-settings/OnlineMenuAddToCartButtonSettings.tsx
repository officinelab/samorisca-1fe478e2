
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductCardButtonIconsDemo } from "./ProductCardButtonIconsDemo";

const ICONS = [
  { value: "bookmark-plus", label: "Bookmark Plus" },
  { value: "circle-plus", label: "Circle Plus" },
  { value: "plus", label: "Plus" },
  { value: "badge-plus", label: "Badge Plus" },
  { value: "circle-check-big", label: "Circle Check Big" },
];

interface OnlineMenuAddToCartButtonSettingsProps {
  value: { color: string; icon: string };
  onChange: (newValue: { color: string; icon: string }) => void;
}

export function OnlineMenuAddToCartButtonSettings({ value, onChange }: OnlineMenuAddToCartButtonSettingsProps) {
  const [color, setColor] = useState(value.color || "#9b87f5");
  const [icon, setIcon] = useState(value.icon || "plus");

  useEffect(() => {
    setColor(value.color || "#9b87f5");
    setIcon(value.icon || "plus");
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onChange({ color: e.target.value, icon });
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIcon(e.target.value);
    onChange({ color, icon: e.target.value });
  };

  return (
    <div className="flex flex-col gap-3 border rounded-md p-3 bg-muted/50 my-2">
      <Label className="mb-1 text-sm">Colore Sfondo Pulsante (mobile)</Label>
      <Input type="color" value={color} onChange={handleColorChange} className="w-12 h-8 border p-0" />
      <Label className="mb-2 mt-2 text-sm">Icona Pulsante</Label>
      <div className="flex gap-3 flex-nowrap overflow-x-auto">
        {ICONS.map(opt => (
          <label key={opt.value} className="flex flex-col items-center cursor-pointer min-w-[55px]">
            <input
              type="radio"
              name="buttonIcon"
              value={opt.value}
              checked={icon === opt.value}
              onChange={handleIconChange}
              className="mb-1 accent-primary"
            />
            <ProductCardButtonIconsDemo iconName={opt.value} color={color} size={20} selected={icon === opt.value} />
            <span className="text-xs mt-1">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
