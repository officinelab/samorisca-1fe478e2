
import { OnlineMenuLayoutSelector } from "./OnlineMenuLayoutSelector";

export function LayoutTypeSelectorInline({
  selectedLayout,
  onSelect,
}: {
  selectedLayout: string;
  onSelect: (layout: string) => void;
}) {
  return (
    <OnlineMenuLayoutSelector selectedLayout={selectedLayout} onSelect={onSelect} />
  );
}
