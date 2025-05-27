import { useState } from "react";
import { DEFAULT_GOOGLE_FONTS } from "./FontSelector";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Plus } from "lucide-react";
interface FontSettingsSectionProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
  baseSizes: any;
}

// Valori di default sicuri
const DEFAULT_SIZES = {
  title: {
    desktop: 18,
    mobile: 18,
    detail: 18
  },
  description: {
    desktop: 14,
    mobile: 14,
    detail: 16
  },
  price: {
    desktop: 16,
    mobile: 16,
    detail: 18
  }
};
const getSafeFontSize = (fontSettings: any, field: 'title' | 'description' | 'price', device: 'desktop' | 'mobile' | 'detail', defaultSize: number): number => {
  return fontSettings?.[field]?.[device]?.fontSize || defaultSize;
};
interface FontSizeControlProps {
  currentSize: number;
  baseSize: number;
  onChange: (size: number) => void;
}
const FontSizeControl: React.FC<FontSizeControlProps> = ({
  currentSize,
  baseSize,
  onChange
}) => {
  const minSize = baseSize - 4;
  const maxSize = baseSize + 4;
  return <div className="flex items-center gap-0">
      <Button variant="outline" size="sm" disabled={currentSize <= minSize} onClick={() => onChange(Math.max(minSize, currentSize - 1))} type="button" className="h-8 w-8 p-0">
        −
      </Button>
      <span className="min-w-[2.8rem] text-center text-sm font-medium">
        {currentSize}px
      </span>
      <Button variant="outline" size="sm" disabled={currentSize >= maxSize} onClick={() => onChange(Math.min(maxSize, currentSize + 1))} type="button" className="h-8 w-8 p-0">
        +
      </Button>
    </div>;
};
const fontFields: ("title" | "description" | "price")[] = ["title", "description", "price"];
const fieldLabels: Record<"title" | "description" | "price", string> = {
  title: "Font Titolo",
  description: "Font Descrizione",
  price: "Font Prezzo"
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
  return <div className="space-y-6">
      {/* Header con titolo */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Font titolo, descrizione, prezzo</h3>
      </div>

      {/* Tabella Header: solo tre colonne per desktop/mobile/dettagli */}
      <div className="grid grid-cols-[380px,1fr,1fr,1fr] gap-4 items-center border-b border-gray-200 pb-3">
        <div></div>
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg py-2 px-3">
            <span className="text-sm font-medium text-gray-700">DESKTOP</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg py-2 px-3">
            <span className="text-sm font-medium text-gray-700">MOBILE</span>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg py-2 px-3">
            <span className="text-sm font-medium text-gray-700">DETTAGLI</span>
          </div>
        </div>
      </div>

      {/* Righe per ogni campo font, su quattro colonne per allineamento perfetto */}
      {fontFields.map(field => {
      const font = fontSettings?.[field] || {};
      return <div key={field}>
            {/* 4 colonne: colonna 1 = controlli font, altre 3 = dimensionamento */}
            <div className="grid grid-cols-[380px,1fr,1fr,1fr] gap-4 items-center py-3">
              {/* Label + controlli font */}
              <div className="flex items-center gap-2">
                <span className="text-gray-900 w-[90px] text-xs font-semibold">{fieldLabels[field]}</span>
                <button type="button" className="p-1.5 rounded border border-gray-300 hover:bg-gray-100" title="Aggiungi font">
                  <Plus size={16} />
                </button>
                <select className="w-[120px] h-9 border rounded px-3 text-sm" value={font.fontFamily || ""} onChange={e => onFontChange(field, {
              ...font,
              fontFamily: e.target.value
            })} style={{
              fontFamily: font.fontFamily
            }}>
                  {availableFonts.map(f => <option key={f} value={f} style={{
                fontFamily: f
              }}>
                      {f}
                    </option>)}
                </select>
                <button type="button" onClick={() => onFontChange(field, {
              ...font,
              fontWeight: font.fontWeight === "bold" ? "normal" : "bold"
            })} className={`p-2 rounded border ${font.fontWeight === "bold" ? "bg-blue-100 border-blue-400 text-blue-700" : "border-gray-300 hover:bg-gray-50"}`} style={{
              width: 32,
              height: 36
            }}>
                  <Bold size={16} />
                </button>
                <button type="button" onClick={() => onFontChange(field, {
              ...font,
              fontStyle: font.fontStyle === "italic" ? "normal" : "italic"
            })} className={`p-2 rounded border ${font.fontStyle === "italic" ? "bg-blue-100 border-blue-400 text-blue-700" : "border-gray-300 hover:bg-gray-50"}`} style={{
              width: 32,
              height: 36
            }}>
                  <Italic size={16} />
                </button>
              </div>

              {/* Desktop Size */}
              <div className="flex justify-center">
                <FontSizeControl currentSize={getSafeFontSize(fontSettings, field, 'desktop', DEFAULT_SIZES[field].desktop)} baseSize={baseSizes?.[field]?.desktop || DEFAULT_SIZES[field].desktop} onChange={newSize => {
              const updatedSettings = {
                ...font,
                desktop: {
                  ...font?.desktop,
                  fontSize: newSize
                }
              };
              onFontChange(field, updatedSettings);
            }} />
              </div>
              
              {/* Mobile Size */}
              <div className="flex justify-center">
                <FontSizeControl currentSize={getSafeFontSize(fontSettings, field, 'mobile', DEFAULT_SIZES[field].mobile)} baseSize={baseSizes?.[field]?.mobile || DEFAULT_SIZES[field].mobile} onChange={newSize => {
              const updatedSettings = {
                ...font,
                mobile: {
                  ...font?.mobile,
                  fontSize: newSize
                }
              };
              onFontChange(field, updatedSettings);
            }} />
              </div>

              {/* Detail Size */}
              <div className="flex justify-center">
                <FontSizeControl currentSize={getSafeFontSize(fontSettings, field, 'detail', DEFAULT_SIZES[field].detail)} baseSize={baseSizes?.[field]?.detail || DEFAULT_SIZES[field].detail} onChange={newSize => {
              const updatedSettings = {
                ...font,
                detail: {
                  ...font?.detail,
                  fontSize: newSize
                }
              };
              onFontChange(field, updatedSettings);
            }} />
              </div>
            </div>
            {/* Separatore tra i campi (tranne l'ultimo) */}
            {field !== 'price' && <div className="border-t border-gray-200"></div>}
          </div>;
    })}
    </div>;
}