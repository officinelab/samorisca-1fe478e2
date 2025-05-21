
import { PrintLayout } from "@/types/printLayout";
import { Card } from "@/components/ui/card";

interface PrintLayoutsListProps {
  layouts: PrintLayout[];
  single?: boolean;
  // Gli handler ora sono opzionali e mai passati se "single"
  onSelectLayout?: (layout: PrintLayout) => void;
  onCloneLayout?: (layoutId: string) => void;
  onDeleteLayout?: (layoutId: string) => void;
  onSetDefaultLayout?: (layoutId: string) => void;
  defaultFirst?: boolean;
}

const PrintLayoutsList = ({
  layouts,
  single = false,
}: PrintLayoutsListProps) => {
  // Mostra sempre solo il primo layout (predefinito)
  if (!layouts || layouts.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-6">
        Nessun layout disponibile.
      </div>
    );
  }
  const layout = layouts[0];
  return (
    <Card
      key={layout.id}
      className={`relative flex flex-col gap-1 p-3 border transition-shadow border-primary shadow-md`}
    >
      <div className="flex flex-col w-full gap-1 items-start">
        <span className="text-sm font-semibold leading-5 break-words whitespace-pre-line" style={{
          maxWidth: "145px",
          wordBreak: "break-word",
          whiteSpace: "pre-line",
        }}>
          {layout.name}
        </span>
        <span className="text-xs text-muted-foreground capitalize truncate max-w-[60px]">
          {layout.type === "custom" ? "Personalizzato" : layout.type}
        </span>
      </div>
      {/* Nessun bottone azione */}
    </Card>
  );
};

export default PrintLayoutsList;
