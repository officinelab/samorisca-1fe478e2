
import { OnlineMenuAddToCartButtonSettings } from "./OnlineMenuAddToCartButtonSettings";

interface ButtonSettingsSectionProps {
  value: { color: string; icon: string };
  onChange: (newValue: { color: string; icon: string }) => void;
}

export function ButtonSettingsSection({ value, onChange }: ButtonSettingsSectionProps) {
  return (
    <OnlineMenuAddToCartButtonSettings value={value} onChange={onChange} />
  );
}
