
import { PrintLayout } from "@/types/printLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Trash, 
  Star, 
  Edit,
  StarOff
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {layouts.map((layout) => (
        <Card key={layout.id} className="relative overflow-hidden">
          {layout.isDefault && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs">
              Predefinito
            </div>
          )}
          <CardHeader>
            <CardTitle>{layout.name}</CardTitle>
            <CardDescription>
              {layout.type === "custom" ? "Personalizzato" : "Predefinito"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onSelectLayout(layout)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifica
              </Button>
              
              <div className="flex space-x-2">
                {!layout.isDefault && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onSetDefaultLayout(layout.id)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Predefinito
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onCloneLayout(layout.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Clona
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
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
                        Stai per eliminare il layout "{layout.name}". 
                        Questa azione non può essere annullata.
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrintLayoutsList;
