
import React from "react";
import { Bold, Italic, Plus, Minus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DEFAULT_GOOGLE_FONTS } from "./FontSelector";

interface FontSettingsTableProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
  availableFonts: string[];
  onAddFont?: () => void;
}

const FONT_SIZE_LIMITS = { 
  title: { min: 14, max: 22 }, 
  description: { min: 12, max: 20 }, 
  price: { min: 14, max: 22 }
};

export function FontSettingsTable({ fontSettings, onFontChange, availableFonts, onAddFont }: FontSettingsTableProps) {
  const handleDeviceSizeChange = (fontType: "title" | "description" | "price", device: "desktop" | "mobile" | "detail", delta: number) => {
    const currentSettings = fontSettings[fontType];
    const currentSize = currentSettings[device]?.fontSize || 16;
    const limits = FONT_SIZE_LIMITS[fontType];
    const newSize = Math.max(limits.min, Math.min(limits.max, currentSize + delta));
    
    onFontChange(fontType, {
      ...currentSettings,
      [device]: { fontSize: newSize }
    });
  };

  const renderFontRow = (fontType: "title" | "description" | "price", label: string) => {
    const settings = fontSettings[fontType];
    const desktopSize = settings.desktop?.fontSize || 16;
    const mobileSize = settings.mobile?.fontSize || 16;
    const detailSize = settings.detail?.fontSize || 16;
    const limits = FONT_SIZE_LIMITS[fontType];

    return (
      <div className="border-b pb-3 mb-3 last:border-b-0">
        <div className="font-semibold text-sm mb-2">{label}</div>
        <div className="flex items-center gap-3">
          {/* Font controls - colonna sinistra */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddFont}
              className="p-1.5 rounded border border-gray-300 hover:bg-gray-100"
              title="Aggiungi font"
            >
              <Plus size={16} />
            </button>
            
            <Select 
              value={settings.fontFamily} 
              onValueChange={v => onFontChange(fontType, { ...settings, fontFamily: v })}
            >
              <SelectTrigger className="w-36 h-8 text-sm" style={{ fontFamily: settings.fontFamily }}>
                <SelectValue>{settings.fontFamily}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableFonts.map(f => (
                  <SelectItem key={f} value={f}>
                    <span style={{ fontFamily: f }}>{f}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={() => onFontChange(fontType, { ...settings, fontWeight: settings.fontWeight === "bold" ? "normal" : "bold" })}
              className={`p-1.5 rounded border ${settings.fontWeight === "bold" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              onClick={() => onFontChange(fontType, { ...settings, fontStyle: settings.fontStyle === "italic" ? "normal" : "italic" })}
              className={`p-1.5 rounded border ${settings.fontStyle === "italic" ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}
            >
              <Italic size={16} />
            </button>
          </div>

          {/* Separatore verticale */}
          <div className="h-8 w-px bg-gray-300 mx-2" />

          {/* Size controls - sulla stessa riga */}
          <div className="flex items-center gap-6">
            {/* Desktop */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">DESKTOP</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDeviceSizeChange(fontType, "desktop", -1)}
                  disabled={desktopSize <= limits.min}
                  className="p-0.5 disabled:opacity-30 hover:bg-gray-100 rounded"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-sm text-center">{desktopSize}px</span>
                <button
                  onClick={() => handleDeviceSizeChange(fontType, "desktop", 1)}
                  disabled={desktopSize >= limits.max}
                  className="p-0.5 disabled:opacity-30 hover:bg-gray-100 rounded"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">MOBILE</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDeviceSizeChange(fontType, "mobile", -1)}
                  disabled={mobileSize <= limits.min}
                  className="p-0.5 disabled:opacity-30 hover:bg-gray-100 rounded"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-sm text-center">{mobileSize}px</span>
                <button
                  onClick={() => handleDeviceSizeChange(fontType, "mobile", 1)}
                  disabled={mobileSize >= limits.max}
                  className="p-0.5 disabled:opacity-30 hover:bg-gray-100 rounded"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Detail */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">DETTAGLI</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDeviceSizeChange(fontType, "detail", -1)}
                  disabled={detailSize <= limits.min}
                  className="p-0.5 disabled:opacity-30 hover:bg-gray-100 rounded"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-sm text-center">{detailSize}px</span>
                <button
                  onClick={() => handleDeviceSizeChange(fontType, "detail", 1)}
                  disabled={detailSize >= limits.max}
                  className="p-0.5 disabled:opacity-30 hover:bg-gray-100 rounded"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {renderFontRow("title", "Font Titolo")}
      {renderFontRow("description", "Font Descrizione")}
      {renderFontRow("price", "Font Prezzo")}
    </div>
  );
}
