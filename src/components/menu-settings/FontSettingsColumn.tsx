
import { OnlineMenuFontSettingsWrapper } from "./OnlineMenuFontSettingsWrapper";

interface FontSettingsColumnProps {
  selectedLayout: string;
  onFontSettingsChange: (settings: any) => void;
}

export function FontSettingsColumn({ selectedLayout, onFontSettingsChange }: FontSettingsColumnProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <OnlineMenuFontSettingsWrapper
        selectedLayout={selectedLayout}
        onFontSettingsChange={onFontSettingsChange}
      />
    </div>
  );
}
