
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateLayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}

const CreateLayoutDialog = ({
  open,
  onOpenChange,
  onCreate,
}: CreateLayoutDialogProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Il nome è obbligatorio.");
      return;
    }

    onCreate(name);
    setName("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea nuovo layout</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="layout-name" className="mb-2">
            Nome del layout
          </Label>
          <Input
            id="layout-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Inserisci un nome per il layout"
            className="mt-1"
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleCreate}>Crea</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLayoutDialog;
