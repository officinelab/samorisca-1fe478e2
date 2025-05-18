
import { PrintLayout } from "@/types/printLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  defaultFirst?: boolean;
}

const PrintLayoutsList = ({
  layouts,
  onSelectLayout,
  onCloneLayout,
  onDeleteLayout,
  onSetDefaultLayout,
  defaultFirst = false,
}: PrintLayoutsListProps) => {
  // Ordina: layout predefinito sempre primo se richiesto
  const sortedLayouts = defaultFirst
    ? [...layouts].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
    : layouts;

  return (
    <div className="flex flex-col gap-4">
      {sortedLayouts.map((layout) => (
        <Card
          key={layout.id}
          className={`relative flex flex-col gap-1 p-3 border transition-shadow ${
            layout.isDefault ? "border-primary shadow-md" : ""
          }`}
        >
          {/* Nessun badge "Predefinito" più */}

          {/* NOME / tipo layout -- stella a sinistra, font più piccolo, testo a capo */}
          <div className="flex flex-row items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-1 w-4/5">
              {/* Stella predefinito */}
              {!layout.isDefault && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSetDefaultLayout(layout.id)}
                  aria-label="Imposta predefinito"
                  className="p-0 mr-1"
                >
                  <Star size={16} className="text-muted-foreground" />
                </Button>
              )}
              {layout.isDefault && (
                <Star
                  size={16}
                  className="text-primary fill-primary"
                  aria-label="Predefinito"
                  // fill rende la stella "piena"
                  style={{ fill: "currentColor" }}
                />
              )}
              <span
                className="text-sm font-semibold leading-5 break-words whitespace-pre-line"
                style={{
                  maxWidth: "145px", // per andare più facilmente a capo se troppo lungo
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {layout.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground capitalize truncate max-w-[60px] text-right">
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
