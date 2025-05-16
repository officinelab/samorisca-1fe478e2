
import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Bold, Italic, Plus } from "lucide-react";

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
  };
  onChange: (value: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" }) => void;
  allowCustomFont?: boolean;
  label?: string;
}

export function FontSelector({
  value,
  onChange,
  allowCustomFont = true,
  label = "Font"
}: FontSelectorProps) {
  const [availableFonts, setAvailableFonts] = useState<string[]>(() => {
    // Recupera da localStorage o usa default all'avvio
    const customFontsJson = localStorage.getItem("publicMenuCustomFonts");
    const customFonts = customFontsJson ? JSON.parse(customFontsJson) as string[] : [];
    return [...DEFAULT_GOOGLE_FONTS, ...customFonts];
  });

  const [showAddFont, setShowAddFont] = useState(false);
  const [fontToAdd, setFontToAdd] = useState("");

  useEffect(() => {
    // Al caricamento inserisci i link dei font selezionabili
    availableFonts.forEach(font => {
      addGoogleFontToHead(font);
    });
  }, [availableFonts]);

  function handleAddFont() {
    if (!fontToAdd.trim()) return;
    if (availableFonts.includes(fontToAdd)) return;
    setAvailableFonts(prev => {
      const newArr = [...prev, fontToAdd];
      // Salva custom font su localStorage
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

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="mb-1 ml-1 text-sm">{label}</span>}
      <div className="flex items-center gap-2">
        <Select value={value.fontFamily} onValueChange={v => onChange({ ...value, fontFamily: v })}>
          <SelectTrigger className="w-56 h-9" style={{ fontFamily: value.fontFamily }}>
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
          <Bold size={20} />
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange("fontStyle")}
          aria-label="Corsivo"
          className={`bg-gray-100 p-1 rounded hover:bg-gray-200 border ${value.fontStyle === "italic" ? "text-blue-600 border-blue-400" : "text-gray-400 border-gray-300"}`}
          style={{ fontFamily: value.fontFamily }}
        >
          <Italic size={20} />
        </button>
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
        <div className="flex gap-2 mt-1 items-center">
          <input
            className="border px-2 py-1 rounded w-44"
            type="text"
            placeholder="Nome Google Font es. Nunito"
            value={fontToAdd}
            onChange={e => setFontToAdd(e.target.value)}
          />
          <button type="button" onClick={handleAddFont} className="text-blue-600 font-bold">
            Aggiungi
          </button>
        </div>
      )}
    </div>
  );
}
