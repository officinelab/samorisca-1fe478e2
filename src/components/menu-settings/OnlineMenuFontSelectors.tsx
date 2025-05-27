
import { FontSelector } from "./FontSelector";
interface SingleFontSetting {
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  fontSize?: number;
}
interface FontSettings {
  title: SingleFontSetting;
  description: SingleFontSetting;
  price: SingleFontSetting;
}
interface OnlineMenuFontSelectorsProps {
  fontSettings: FontSettings;
  onFontChange: (key: "title" | "description" | "price", value: SingleFontSetting) => void;
}
export function OnlineMenuFontSelectors({
  fontSettings,
  onFontChange
}: OnlineMenuFontSelectorsProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <FontSelector label="Font Titolo" value={fontSettings.title} onChange={val => onFontChange("title", val)} defaultFontSize={18} />
      <FontSelector label="Font Descrizione" value={fontSettings.description} onChange={val => onFontChange("description", val)} defaultFontSize={16} />
      <FontSelector label="Font Prezzo" value={fontSettings.price} onChange={val => onFontChange("price", val)} defaultFontSize={18} />
    </div>
  );
}
