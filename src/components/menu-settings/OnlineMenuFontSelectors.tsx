import { FontSelector } from "./FontSelector";
interface SingleFontSetting {
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
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
  return <div className="flex gap-10 mb-6 flex-wrap items-center justify-left">
      <FontSelector label="Font Titolo" value={fontSettings.title} onChange={val => onFontChange("title", val)} />
      <FontSelector label="Font Descrizione" value={fontSettings.description} onChange={val => onFontChange("description", val)} />
      <FontSelector label="Font Prezzo" value={fontSettings.price} onChange={val => onFontChange("price", val)} />
    </div>;
}