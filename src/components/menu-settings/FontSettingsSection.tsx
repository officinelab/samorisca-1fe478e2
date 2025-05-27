
import React from "react";
import { Button } from "@/components/ui/button";
import { OnlineMenuFontSelectors } from "./OnlineMenuFontSelectors";

interface FontSettingsSectionProps {
  fontSettings: any;
  fontSizes: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
  onFontSizeChange: (category: "title" | "description" | "price", column: "desktop" | "mobile" | "details", value: number) => void;
  min?: number;
  max?: number;
}

const LABELS = {
  title: "Font Titolo",
  description: "Font Descrizione",
  price: "Font Prezzo",
};

const COLUMNS = [
  { key: "desktop", label: "DESKTOP" },
  { key: "mobile", label: "MOBILE" },
  { key: "details", label: "DETTAGLI" },
];

export function FontSettingsSection({
  fontSettings,
  fontSizes,
  onFontChange,
  onFontSizeChange,
  min = 8,
  max = 40,
}: FontSettingsSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {Object.keys(fontSettings).map((sectionKey) => (
        <div key={sectionKey} className="flex items-center gap-4">
          {/* Font selector e stili */}
          <div className="min-w-[270px]">
            <OnlineMenuFontSelectors
              fontSettings={{ [sectionKey]: fontSettings[sectionKey] }}
              onFontChange={(k, v) => onFontChange(sectionKey, v)}
            />
          </div>
          {/* Controller dimensioni (stepper per 3 anteprime) */}
          <div className="flex flex-row gap-3">
            {COLUMNS.map((col) => (
              <div key={col.key} className="flex flex-col items-center min-w-[72px]">
                <div className="text-xs font-semibold text-gray-600 mb-1">{col.label}</div>
                <div className="flex items-center">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="w-6 h-6 p-0"
                    onClick={() =>
                      onFontSizeChange(sectionKey as any, col.key as any, Math.max(min, fontSizes[sectionKey][col.key] - 1))
                    }
                    disabled={fontSizes[sectionKey][col.key] <= min}
                  >–</Button>
                  <div className="w-10 text-center text-base select-none">{fontSizes[sectionKey][col.key]}px</div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="w-6 h-6 p-0"
                    onClick={() =>
                      onFontSizeChange(sectionKey as any, col.key as any, Math.min(max, fontSizes[sectionKey][col.key] + 1))
                    }
                    disabled={fontSizes[sectionKey][col.key] >= max}
                  >+</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
