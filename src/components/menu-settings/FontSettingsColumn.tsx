
import { OnlineMenuFontSettingsWrapper } from "./OnlineMenuFontSettingsWrapper";

interface FontSettingsColumnProps {
  selectedLayout: string;
  fontSettings: any;
  onFontSettingsChange: (settings: any) => void;
  setFontSettings: (val: any) => void;
}

export function FontSettingsColumn({ selectedLayout, fontSettings, onFontSettingsChange, setFontSettings }: FontSettingsColumnProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <OnlineMenuFontSettingsWrapper
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        onFontSettingsChange={onFontSettingsChange}
        setFontSettings={setFontSettings}
      />
    </div>
  );
}
