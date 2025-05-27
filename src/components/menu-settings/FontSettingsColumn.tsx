
import { OnlineMenuFontSettingsWrapper } from "./OnlineMenuFontSettingsWrapper";

interface FontSettingsColumnProps {
  selectedLayout: string;
  onFontSettingsChange: (settings: any) => void;
}

export function FontSettingsColumn({ selectedLayout, onFontSettingsChange }: FontSettingsColumnProps) {
  return (
    <div className="bg-muted/50 rounded-md p-3">
      <h3 className="text-base font-semibold mb-2">Font titolo, descrizione, prezzo</h3>
      <OnlineMenuFontSettingsWrapper
        selectedLayout={selectedLayout}
        onFontSettingsChange={onFontSettingsChange}
      />
    </div>
  );
}
