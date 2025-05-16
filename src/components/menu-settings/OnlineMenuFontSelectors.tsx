
import { FontSelector } from "./FontSelector";

interface FontSettings {
  title: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
  description: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
}

interface OnlineMenuFontSelectorsProps {
  fontSettings: FontSettings;
  onFontChange: (key: "title" | "description", value: any) => void;
}

export function OnlineMenuFontSelectors({ fontSettings, onFontChange }: OnlineMenuFontSelectorsProps) {
  return (
    <div className="flex gap-10 mb-6 flex-wrap items-center justify-center">
      <FontSelector
        label="Font Titolo"
        value={fontSettings.title}
        onChange={val => onFontChange("title", val)}
      />
      <FontSelector
        label="Font Descrizione"
        value={fontSettings.description}
        onChange={val => onFontChange("description", val)}
      />
    </div>
  );
}
