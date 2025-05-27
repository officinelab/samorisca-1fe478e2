
import { useState } from "react";
import { DEFAULT_GOOGLE_FONTS } from "./FontSelector";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Plus } from "lucide-react";

interface FontSettingsSectionProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
  baseSizes: any;
}

// Valori di default sicuri per tutte le varianti
const DEFAULT_SIZES = {
  title: { desktop: 18, mobile: 18, detail: 18 },
  description: { desktop: 14, mobile: 14, detail: 16 },
  price: { desktop: 16, mobile: 16, detail: 18 }
};

const getSafeFontSize = (
  fontSettings: any, 
  field: 'title' | 'description' | 'price',
  device: 'desktop' | 'mobile' | 'detail',
  defaultSize: number
): number => {
  return fontSettings?.[field]?.[device]?.fontSize || defaultSize;
};

interface FontSizeControlProps {
  label: string;
  baseSize: number;
  currentSize: number;
  onChange: (size: number) => void;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({
  label,
  baseSize,
  currentSize,
  onChange
}) => {
  const minSize = baseSize - 4;
  const maxSize = baseSize + 4;
  
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentSize <= minSize}
          onClick={() => onChange(Math.max(minSize, currentSize - 1))}
          type="button"
        >
          -
        </Button>
        <span className="min-w-[3rem] text-center text-sm">
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
      </div>
      <span className="text-xs text-muted-foreground">
        (Base: {baseSize}px)
      </span>
    </div>
  );
};

// Array tipizzato per mapping sicuro
const fontFields: ("title" | "description" | "price")[] = ["title", "description", "price"];
const fieldLabels: Record<"title" | "description" | "price", string> = {
  title: "Titolo",
  description: "Descrizione",
  price: "Prezzo"
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

  return (
    <div className="space-y-4">
      {fontFields.map((field) => {
        const devices: ('desktop' | 'mobile' | 'detail')[] = ['desktop', 'mobile', 'detail'];
        const font = fontSettings?.[field] || {};
        return (
          <div key={field} className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">{fieldLabels[field]}</h4>
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
                value={font.fontFamily || ""}
                onChange={e => onFontChange(field, { ...font, fontFamily: e.target.value })}
                style={{ fontFamily: font.fontFamily }}
              >
                {availableFonts.map(f => (
                  <option key={f} value={f} style={{ fontFamily: f }}>
                    {f}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onFontChange(field, { ...font, fontWeight: font.fontWeight === "bold" ? "normal" : "bold" })}
                className={`p-1.5 rounded border ${font.fontWeight === "bold" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                onClick={() => onFontChange(field, { ...font, fontStyle: font.fontStyle === "italic" ? "normal" : "italic" })}
                className={`p-1.5 rounded border ${font.fontStyle === "italic" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}
              >
                <Italic size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {devices.map((device) => {
                const currentSize = getSafeFontSize(fontSettings, field, device, DEFAULT_SIZES[field][device]);
                const baseSize = baseSizes?.[field]?.[device] || DEFAULT_SIZES[field][device];
                return (
                  <FontSizeControl
                    key={`${field}-${device}`}
                    label={device.charAt(0).toUpperCase() + device.slice(1)}
                    baseSize={baseSize}
                    currentSize={currentSize}
                    onChange={(newSize) => {
                      const updatedSettings = {
                        ...font,
                        [device]: { 
                          ...font?.[device],
                          fontSize: newSize 
                        }
                      };
                      onFontChange(field, updatedSettings);
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
