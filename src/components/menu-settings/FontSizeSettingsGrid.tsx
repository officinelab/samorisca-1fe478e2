
import React from "react";
import { Button } from "@/components/ui/button";

const FIELDS = [
  { key: "title", label: "Font Titolo" },
  { key: "description", label: "Font Descrizione" },
  { key: "price", label: "Font Prezzo" },
];
const COLUMNS = [
  { key: "desktop", label: "DESKTOP" },
  { key: "mobile", label: "MOBILE" },
  { key: "details", label: "DETTAGLI" },
];

type FontSizes = {
  title: { desktop: number; mobile: number; details: number };
  description: { desktop: number; mobile: number; details: number };
  price: { desktop: number; mobile: number; details: number };
};

interface Props {
  fontSizes: FontSizes;
  onChange: (category: "title" | "description" | "price", column: "desktop" | "mobile" | "details", value: number) => void;
  min?: number;
  max?: number;
}

export const FontSizeSettingsGrid: React.FC<Props> = ({
  fontSizes,
  onChange,
  min = 8,
  max = 40,
}) => {
  return (
    <div className="flex flex-row gap-5">
      <div className="flex flex-col gap-7 min-w-[200px]">
        {FIELDS.map((f) => (
          <div key={f.key} className="h-11 flex items-center font-medium">{f.label}</div>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            className="border rounded-lg px-3 py-2 flex flex-col items-center min-w-[110px]"
            style={{ minWidth: 110 }}
          >
            <div className="text-xs font-semibold mb-1">{col.label}</div>
            {FIELDS.map((field) => (
              <div key={field.key} className="flex items-center mb-1">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="w-6 h-6 p-0"
                  onClick={() =>
                    onChange(field.key as any, col.key as any, Math.max(min, fontSizes[field.key][col.key] - 1))
                  }
                  disabled={fontSizes[field.key][col.key] <= min}
                >–</Button>
                <div className="w-12 text-center text-base select-none">{fontSizes[field.key][col.key]}px</div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="w-6 h-6 p-0"
                  onClick={() =>
                    onChange(field.key as any, col.key as any, Math.min(max, fontSizes[field.key][col.key] + 1))
                  }
                  disabled={fontSizes[field.key][col.key] >= max}
                >+</Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
