
import React from "react";
import { DEFAULT_FONTS } from "../OnlineMenuLayoutSection";

interface FontSelectorProps {
  value: string;
  onChange: (fontCss: string) => void;
  extraFonts?: string[]
}

// Mostra una lista base di font + eventuali nuovi font
export const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange, extraFonts = [] }) => {
  // Unisci font di default a quelli personalizzati caricati dall’utente
  const options = [
    ...DEFAULT_FONTS,
    ...extraFonts
      .filter(fontName => !DEFAULT_FONTS.find(f => f.name === fontName))
      .map(fontName => ({
        name: fontName,
        css: `'${fontName}', sans-serif`
      }))
  ];

  return (
    <select
      className="border rounded px-2 py-1"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(font => (
        <option value={font.css} key={font.name} style={{ fontFamily: font.css }}>
          {font.name}
        </option>
      ))}
    </select>
  );
};

