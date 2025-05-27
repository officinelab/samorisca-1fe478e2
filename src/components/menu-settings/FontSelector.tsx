
import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Bold, Italic, Plus, Minus, ExternalLink } from "lucide-react"; // Importa Minus

export const DEFAULT_GOOGLE_FONTS = [
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Poppins",
  "Merriweather",
  "Playfair Display",
  "Oswald",
  "Raleway",
];

interface FontSelectorProps {
  value: {
    fontFamily: string;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    fontSize?: number; // pixel (opzionale per retrocompatibilità)
  };
  onChange: (value: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic"; fontSize?: number }) => void;
  allowCustomFont?: boolean;
  label?: string;
  defaultFontSize?: number; // per sapere il valore base in questo contesto
}

const FONT_SIZE_LIMITS = { 
  title: { min: 14, max: 22, default: 18 }, 
  description: { min: 12, max: 20, default: 16 }, 
  price: { min: 14, max: 22, default: 18 }
};

export function FontSelector({
  value,
  onChange,
  allowCustomFont = true,
  label = "Font",
  defaultFontSize = 16 // fallback: description
}: FontSelectorProps) {
  const [availableFonts, setAvailableFonts] = useState<string[]>(() => {
    const customFontsJson = localStorage.getItem("publicMenuCustomFonts");
    const customFonts = customFontsJson ? JSON.parse(customFontsJson) as string[] : [];
    return [...DEFAULT_GOOGLE_FONTS, ...customFonts];
  });

  const [showAddFont, setShowAddFont] = useState(false);
  const [fontToAdd, setFontToAdd] = useState("");

  useEffect(() => {
    availableFonts.forEach(font => {
      addGoogleFontToHead(font);
    });
  }, [availableFonts]);

  function handleAddFont() {
    if (!fontToAdd.trim()) return;
    if (availableFonts.includes(fontToAdd)) return;
    setAvailableFonts(prev => {
      const newArr = [...prev, fontToAdd];
      localStorage.setItem("publicMenuCustomFonts", JSON.stringify(newArr.filter(f => !DEFAULT_GOOGLE_FONTS.includes(f))));
      return newArr;
    });
    addGoogleFontToHead(fontToAdd);
    setFontToAdd("");
    setShowAddFont(false);
  }

  function addGoogleFontToHead(font: string) {
    const fontKey = font.replace(/ /g, "+");
    const existing = document.querySelector(`link[data-font="${fontKey}"]`);
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css?family=${fontKey}:400,700,400italic,700italic&display=swap`;
    link.setAttribute("data-font", fontKey);
    document.head.appendChild(link);
  }

  function handleStyleChange(styleKey: "fontWeight" | "fontStyle") {
    const next = { ...value };
    if (styleKey === "fontWeight") {
      next.fontWeight = value.fontWeight === "bold" ? "normal" : "bold";
    } else if (styleKey === "fontStyle") {
      next.fontStyle = value.fontStyle === "italic" ? "normal" : "italic";
    }
    onChange(next);
  }

  // Determina limiti effettivi in base a label
  let min = defaultFontSize - 2, max = defaultFontSize + 4, base = defaultFontSize;
  if (label?.toLowerCase().includes("titolo")) {
    min = FONT_SIZE_LIMITS.title.min; max = FONT_SIZE_LIMITS.title.max; base = FONT_SIZE_LIMITS.title.default;
  } else if (label?.toLowerCase().includes("descrizione")) {
    min = FONT_SIZE_LIMITS.description.min; max = FONT_SIZE_LIMITS.description.max; base = FONT_SIZE_LIMITS.description.default;
  } else if (label?.toLowerCase().includes("prezzo")) {
    min = FONT_SIZE_LIMITS.price.min; max = FONT_SIZE_LIMITS.price.max; base = FONT_SIZE_LIMITS.price.default;
  }
  const fontSize = typeof value.fontSize === 'number' ? value.fontSize : base;

  const decrementFontSize = () => {
    if (fontSize > min) onChange({ ...value, fontSize: fontSize - 1 });
  };
  const incrementFontSize = () => {
    if (fontSize < max) onChange({ ...value, fontSize: fontSize + 1 });
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="mb-1 ml-1 text-xs font-semibold">{label}</span>}
      <div className="flex items-center gap-2">
        <Select value={value.fontFamily} onValueChange={v => onChange({ ...value, fontFamily: v })}>
          <SelectTrigger className="w-48 h-8 text-sm" style={{ fontFamily: value.fontFamily }}>
            <SelectValue placeholder="Seleziona font" style={{ fontFamily: value.fontFamily }}>{value.fontFamily}</SelectValue>
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
          onClick={() => handleStyleChange("fontWeight")}
          aria-label="Grassetto"
          className={`bg-gray-100 p-1 rounded hover:bg-gray-200 border ${value.fontWeight === "bold" ? "text-blue-600 border-blue-400" : "text-gray-400 border-gray-300"}`}
          style={{ fontFamily: value.fontFamily }}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange("fontStyle")}
          aria-label="Corsivo"
          className={`bg-gray-100 p-1 rounded hover:bg-gray-200 border ${value.fontStyle === "italic" ? "text-blue-600 border-blue-400" : "text-gray-400 border-gray-300"}`}
          style={{ fontFamily: value.fontFamily }}
        >
          <Italic size={16} />
        </button>
        {/* Font size controls */}
        <div className="flex items-center ml-2 gap-1 bg-gray-50 rounded px-1 border border-gray-200">
          <button
            type="button"
            className="p-0.5 rounded disabled:text-gray-300"
            title="Riduci grandezza testo"
            onClick={decrementFontSize}
            disabled={fontSize <= min}
            style={{ background: "transparent" }}>
            <Minus size={15} />
          </button>
          <span className="w-6 text-xs text-center" style={{ fontFamily: value.fontFamily }}>{fontSize}px</span>
          <button
            type="button"
            className="p-0.5 rounded disabled:text-gray-300"
            title="Aumenta grandezza testo"
            onClick={incrementFontSize}
            disabled={fontSize >= max}
            style={{ background: "transparent" }}>
            <Plus size={15} />
          </button>
        </div>
        {allowCustomFont && (
          <button
            type="button"
            onClick={() => setShowAddFont(v => !v)}
            className="ml-2 bg-gray-100 p-1 rounded border border-gray-300 hover:bg-gray-200"
            aria-label="Aggiungi nuovo font Google"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      {showAddFont && (
        <div className="flex flex-col gap-1 mt-2 rounded-md border border-blue-100 px-3 py-2 bg-blue-50 max-w-md relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-900 text-sm">Aggiungi un font Google personalizzato</span>
            <a
              href="https://fonts.google.com/?subset=latin&sort=popularity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline ml-2 group"
              title="Vedi elenco completo dei Google Fonts"
            >
              Vedi elenco completo
              <ExternalLink size={16} className="group-hover:text-blue-800" />
            </a>
          </div>
          <span className="text-xs text-muted-foreground mb-1">
            <span>Scrivi qui il <b>nome esatto</b> del font così come appare su Google Fonts (es. “Nunito”).</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              className="border px-2 py-1 rounded w-44"
              type="text"
              placeholder="Nome Google Font es. Nunito"
              value={fontToAdd}
              onChange={e => setFontToAdd(e.target.value)}
            />
            <button 
              type="button"
              onClick={handleAddFont}
              className="text-white bg-blue-600 px-3 py-1 rounded font-bold hover:bg-blue-800 transition-colors text-sm"
            >
              Aggiungi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
