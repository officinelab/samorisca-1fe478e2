
import { OnlineMenuFontSelectors } from "./OnlineMenuFontSelectors";

interface FontSettingsSectionProps {
  fontSettings: any;
  onFontChange: (key: "title" | "description" | "price", value: any) => void;
}

export function FontSettingsSection({ fontSettings, onFontChange }: FontSettingsSectionProps) {
  return (
    <OnlineMenuFontSelectors fontSettings={fontSettings} onFontChange={onFontChange} />
  );
}
