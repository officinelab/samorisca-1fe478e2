
import { PrintLayout } from "@/types/printLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Trash2,
  Star,
  Edit,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface PrintLayoutsListProps {
  layouts: PrintLayout[];
  onSelectLayout: (layout: PrintLayout) => void;
  onCloneLayout: (layoutId: string) => void;
  onDeleteLayout: (layoutId: string) => void;
  onSetDefaultLayout: (layoutId: string) => void;
}

const PrintLayoutsList = ({
  layouts,
  onSelectLayout,
  onCloneLayout,
  onDeleteLayout,
  onSetDefaultLayout,
}: PrintLayoutsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {layouts.map((layout) => (
        <Card
          key={layout.id}
          className={`relative flex flex-col gap-1 p-3 border transition-shadow ${layout.isDefault ? "border-primary shadow-md" : ""}`}
        >
          {/* Badge predefinito */}
          {layout.isDefault && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-semibold shadow">
              Predefinito
            </span>
          )}
          {/* NOME / tipo layout */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-base font-bold leading-5 truncate">{layout.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {layout.type === "custom" ? "Personalizzato" : layout.type}
            </span>
          </div>
          {/* Bottoni solo icone, ora su una riga sotto */}
          <div className="flex flex-row gap-2 mt-2 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSelectLayout(layout)}
              aria-label="Modifica"
              className="flex-1"
            >
              <Edit size={18} />
            </Button>
            {!layout.isDefault && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSetDefaultLayout(layout.id)}
                aria-label="Imposta predefinito"
                className="flex-1"
              >
                <Star size={18} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCloneLayout(layout.id)}
              aria-label="Clona"
              className="flex-1"
            >
              <Copy size={18} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Elimina"
                  className="flex-1"
                  disabled={layouts.length <= 1}
                >
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Stai per eliminare il layout "{layout.name}". Questa azione non può essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteLayout(layout.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      ))}
      {layouts.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-6">
          Nessun layout disponibile.
        </div>
      )}
    </div>
  );
};

export default PrintLayoutsList;
