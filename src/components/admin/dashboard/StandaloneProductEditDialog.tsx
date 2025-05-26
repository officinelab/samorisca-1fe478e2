
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/database";

interface StandaloneProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

// Componente indipendente con gestione locale dello stato
const StandaloneProductEditDialog: React.FC<StandaloneProductEditDialogProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  // Stato locale per tutti i campi del prodotto editabile
  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price_standard ? String(product.price_standard) : "");
  const [isActive, setIsActive] = useState(product.is_active ?? true);
  const [imageUrl, setImageUrl] = useState(product.image_url || "");

  // Reset al cambio prodotto o apertura dialog
  React.useEffect(() => {
    setTitle(product.title || "");
    setDescription(product.description || "");
    setPrice(product.price_standard ? String(product.price_standard) : "");
    setIsActive(product.is_active ?? true);
    setImageUrl(product.image_url || "");
  }, [product, open]);

  // Simulazione salvataggio (replace with API call/Supabase logic)
  const handleSave = () => {
    // qui andrebbe la logica reale di update
    // console.log("Salva i dati:", { title, description, price, isActive, imageUrl });
    onOpenChange(false);
    alert("Prodotto aggiornato (demo, salva la logica reale qui)");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica prodotto (Modal Non Dipendente)</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <Label>Nome prodotto</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Descrizione</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Prezzo Standard (€)</Label>
            <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <Label>Immagine (URL)</Label>
            <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <span>Attivo</span>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit" variant="default">Salva Modifiche</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StandaloneProductEditDialog;
