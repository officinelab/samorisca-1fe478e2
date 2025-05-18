
import { PrintLayout } from "@/types/printLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Trash,
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
  AlertDialogDescription, // <-- AGGIUNTO L'IMPORT
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
          className={`relative flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 border transition-shadow ${layout.isDefault ? "border-primary shadow-md" : ""}`}
        >
          {/* Badge predefinito */}
          {layout.isDefault && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-semibold shadow">
              Predefinito
            </span>
          )}
          {/* NOME layout / tipo */}
          <div className="flex-1 flex flex-col gap-1 justify-center">
            <span className="text-base font-bold leading-5 truncate">{layout.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{layout.type === "custom" ? "Personalizzato" : layout.type}</span>
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 md:ml-4 flex-none w-full md:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 whitespace-nowrap"
              onClick={() => onSelectLayout(layout)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifica
            </Button>
            {!layout.isDefault && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 whitespace-nowrap"
                onClick={() => onSetDefaultLayout(layout.id)}
              >
                <Star className="mr-2 h-4 w-4" />
                Predefinito
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 whitespace-nowrap"
              onClick={() => onCloneLayout(layout.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Clona
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 whitespace-nowrap"
                  disabled={layouts.length <= 1}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Elimina
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
