import { useState } from "react";
import { DEFAULT_GOOGLE_FONTS } from "./FontSelector";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Plus } from "lucide-react";

interface FontSettingsSectionProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
  baseSizes: any;
}

// Mini-componente per i controlli di dimensione
const FontSizeControl = ({
  label,
  baseSize,
  currentSize,
  onChange
}: {
  label: string;
  baseSize: number;
  currentSize: number;
  onChange: (size: number) => void;
}) => {
  const minSize = baseSize - 4;
  const maxSize = baseSize + 4;

  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-sm">{label}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentSize <= minSize}
        onClick={() => onChange(Math.max(minSize, currentSize - 1))}
        type="button"
      >
        -
      </Button>
      <span className="min-w-[2.5rem] text-center text-sm">
        {currentSize}px
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentSize >= maxSize}
        onClick={() => onChange(Math.min(maxSize, currentSize + 1))}
        type="button"
      >
        +
      </Button>
      <span className="text-xs text-muted-foreground">(Base: {baseSize}px)</span>
    </div>
  );
};

// Validazione range ±4pt
const validateFontSize = (size: number, baseSize: number): number => {
  const minSize = baseSize - 4;
  const maxSize = baseSize + 4;
  return Math.max(minSize, Math.min(maxSize, size));
};

export function FontSettingsSection({
  fontSettings,
  onFontChange,
  baseSizes
}: FontSettingsSectionProps) {
  const [availableFonts] = useState<string[]>(() => {
    const customFontsJson = localStorage.getItem("publicMenuCustomFonts");
    const customFonts = customFontsJson ? JSON.parse(customFontsJson) as string[] : [];
    return [...DEFAULT_GOOGLE_FONTS, ...customFonts];
  });

  // Array tipizzato per mapping sicuro
  const fontFields: ("title" | "description" | "price")[] = ["title", "description", "price"];
  const fieldLabels: Record<"title" | "description" | "price", string> = {
    title: "Titolo",
    description: "Descrizione",
    price: "Prezzo"
  };

  return (
    <div className="space-y-4">
      {fontFields.map((key) => (
        <div key={key} className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">{fieldLabels[key]}</h4>
          {/* Font family, weight, style controls */}
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              className="p-1.5 rounded border border-gray-300 hover:bg-gray-100"
              title="Aggiungi font"
              // Per la demo non implementiamo l'onAddFont
            >
              <Plus size={16} />
            </button>
            <select
              className="w-36 h-8 border rounded px-2 text-sm"
              value={fontSettings[key].fontFamily}
              onChange={e => onFontChange(key, { ...fontSettings[key], fontFamily: e.target.value })}
              style={{ fontFamily: fontSettings[key].fontFamily }}
            >
              {availableFonts.map(f => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onFontChange(key, { ...fontSettings[key], fontWeight: fontSettings[key].fontWeight === "bold" ? "normal" : "bold" })}
              className={`p-1.5 rounded border ${fontSettings[key].fontWeight === "bold" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => onFontChange(key, { ...fontSettings[key], fontStyle: fontSettings[key].fontStyle === "italic" ? "normal" : "italic" })}
              className={`p-1.5 rounded border ${fontSettings[key].fontStyle === "italic" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}
            >
              <Italic size={16} />
            </button>
          </div>
          {/* Controlli dimensione per Desktop, Mobile, Detail */}
          <div className="space-y-2">
            <FontSizeControl
              label="Desktop"
              baseSize={baseSizes[key].desktop}
              currentSize={fontSettings[key].desktop.fontSize}
              onChange={size =>
                onFontChange(key, {
                  ...fontSettings[key],
                  desktop: { fontSize: validateFontSize(size, baseSizes[key].desktop) }
                })
              }
            />
            <FontSizeControl
              label="Mobile"
              baseSize={baseSizes[key].mobile}
              currentSize={fontSettings[key].mobile.fontSize}
              onChange={size =>
                onFontChange(key, {
                  ...fontSettings[key],
                  mobile: { fontSize: validateFontSize(size, baseSizes[key].mobile) }
                })
              }
            />
            <FontSizeControl
              label="Dettaglio"
              baseSize={baseSizes[key].detail}
              currentSize={fontSettings[key].detail.fontSize}
              onChange={size =>
                onFontChange(key, {
                  ...fontSettings[key],
                  detail: { fontSize: validateFontSize(size, baseSizes[key].detail) }
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
