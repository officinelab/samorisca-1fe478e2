
import { Button } from "@/components/ui/button";

interface OnlineMenuLayoutSelectorProps {
  selectedLayout: string;
  onSelect: (layout: string) => void;
}

export function OnlineMenuLayoutSelector({ selectedLayout, onSelect }: OnlineMenuLayoutSelectorProps) {
  return (
    <div className="flex gap-3 justify-center mb-5">
      <Button
        size="sm"
        variant={selectedLayout === "default" ? "default" : "outline"}
        className="mx-auto"
        onClick={() => onSelect("default")}
      >
        Classico
      </Button>
      <Button
        size="sm"
        variant={selectedLayout === "custom1" ? "default" : "outline"}
        className="mx-auto"
        onClick={() => onSelect("custom1")}
      >
        Custom 1
      </Button>
    </div>
  );
}
