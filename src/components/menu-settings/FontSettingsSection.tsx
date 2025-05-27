
import { OnlineMenuFontSelectors } from "./OnlineMenuFontSelectors";

interface FontSettingsSectionProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
  label: string;
}

export function FontSettingsSection({ fontSettings, onFontChange, label }: FontSettingsSectionProps) {
  return (
    <div>
      <div className="font-bold mb-1">{label}</div>
      <OnlineMenuFontSelectors fontSettings={fontSettings} onFontChange={onFontChange} />
    </div>
  );
}
