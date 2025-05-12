
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LabelBadge } from "./LabelBadge";
import { ProductLabel } from "@/hooks/menu-settings/useProductLabels";

interface LabelFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentLabel: Partial<ProductLabel>;
  setCurrentLabel: (label: Partial<ProductLabel>) => void;
  isEditing: boolean;
  onSave: () => void;
}

export const LabelFormDialog = ({
  isOpen,
  setIsOpen,
  currentLabel,
  setCurrentLabel,
  isEditing,
  onSave
}: LabelFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica Etichetta" : "Nuova Etichetta"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica i dettagli dell'etichetta selezionata."
              : "Inserisci i dettagli per la nuova etichetta."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titolo *
            </label>
            <Input
              id="title"
              value={currentLabel.title || ''}
              onChange={(e) => setCurrentLabel({...currentLabel, title: e.target.value})}
              placeholder="Nome dell'etichetta"
            />
          </div>

          {/* Anteprima dell'etichetta */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Anteprima
            </label>
            <div className="p-4 bg-gray-50 rounded-md border flex items-center justify-center">
              <LabelBadge
                title={currentLabel.title || "Anteprima Etichetta"}
                color={currentLabel.color}
                textColor={currentLabel.text_color}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="color" className="text-sm font-medium">
              Colore Sfondo (opzionale)
            </label>
            <div className="flex gap-3 items-center">
              <Input
                id="color"
                type="color"
                value={currentLabel.color || '#e2e8f0'}
                onChange={(e) => setCurrentLabel({...currentLabel, color: e.target.value})}
                className="w-14 h-9 p-1"
              />
              <Input
                type="text"
                value={currentLabel.color || ''}
                onChange={(e) => setCurrentLabel({...currentLabel, color: e.target.value})}
                placeholder="Codice colore (es. #FF0000)"
                className="flex-1"
              />
              {currentLabel.color && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentLabel({...currentLabel, color: null})}
                  title="Rimuovi colore"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="text_color" className="text-sm font-medium">
              Colore Testo (opzionale)
            </label>
            <div className="flex gap-3 items-center">
              <Input
                id="text_color"
                type="color"
                value={currentLabel.text_color || '#000000'}
                onChange={(e) => setCurrentLabel({...currentLabel, text_color: e.target.value})}
                className="w-14 h-9 p-1"
              />
              <Input
                type="text"
                value={currentLabel.text_color || ''}
                onChange={(e) => setCurrentLabel({...currentLabel, text_color: e.target.value})}
                placeholder="Codice colore (es. #FFFFFF)"
                className="flex-1"
              />
              {currentLabel.text_color && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentLabel({...currentLabel, text_color: null})}
                  title="Auto (in base allo sfondo)"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Se non specificato, il colore del testo sarà automaticamente nero o bianco in base al colore di sfondo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            <X size={16} className="mr-2" /> Annulla
          </Button>
          <Button
            onClick={onSave}
          >
            <Check size={16} className="mr-2" />
            {isEditing ? "Aggiorna" : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
