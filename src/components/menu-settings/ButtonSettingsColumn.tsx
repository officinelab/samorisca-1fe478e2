import { OnlineMenuButtonSettingsWrapper } from "./OnlineMenuButtonSettingsWrapper";
interface ButtonSettingsColumnProps {
  selectedLayout: string;
  onButtonSettingsChange: (settings: any) => void;
}
export function ButtonSettingsColumn({
  selectedLayout,
  onButtonSettingsChange
}: ButtonSettingsColumnProps) {
  return <div className="rounded-md p-3 bg-neutral-50">
      <h3 className="text-base font-semibold mb-2">Pulsante "Aggiungi al carrello"</h3>
      <OnlineMenuButtonSettingsWrapper selectedLayout={selectedLayout} onButtonSettingsChange={onButtonSettingsChange} />
    </div>;
}