
import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, GripVertical, X, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductLabel {
  id: string;
  title: string;
  color?: string | null;
  text_color?: string | null;
  display_order: number;
}

const ProductLabelsManager = () => {
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<Partial<ProductLabel>>({});

  const fetchLabels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_labels")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setLabels(data || []);
    } catch (error) {
      console.error("Errore nel caricamento delle etichette:", error);
      toast.error("Impossibile caricare le etichette");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleOpenDialog = (label?: ProductLabel) => {
    if (label) {
      setCurrentLabel(label);
      setIsEditing(true);
    } else {
      setCurrentLabel({});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveLabel = async () => {
    if (!currentLabel.title) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    try {
      if (isEditing && currentLabel.id) {
        const { error } = await supabase
          .from("product_labels")
          .update({
            title: currentLabel.title,
            color: currentLabel.color,
            text_color: currentLabel.text_color,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentLabel.id);

        if (error) throw error;
        toast.success("Etichetta aggiornata con successo");
      } else {
        const maxOrder = labels.length > 0 
          ? Math.max(...labels.map(l => l.display_order)) + 1 
          : 0;
          
        const { error } = await supabase
          .from("product_labels")
          .insert({
            title: currentLabel.title,
            color: currentLabel.color,
            text_color: currentLabel.text_color,
            display_order: maxOrder
          });

        if (error) throw error;
        toast.success("Etichetta creata con successo");
      }

      setIsDialogOpen(false);
      fetchLabels();
    } catch (error) {
      console.error("Errore durante il salvataggio dell'etichetta:", error);
      toast.error("Impossibile salvare l'etichetta");
    }
  };

  const handleDeleteLabel = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa etichetta?")) return;
    
    try {
      const { error } = await supabase
        .from("product_labels")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Etichetta eliminata con successo");
      fetchLabels();
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'etichetta:", error);
      toast.error("Impossibile eliminare l'etichetta");
    }
  };

  const reorderLabels = async (draggedId: string, targetId: string) => {
    const draggedIndex = labels.findIndex(label => label.id === draggedId);
    const targetIndex = labels.findIndex(label => label.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newLabels = [...labels];
    const [draggedItem] = newLabels.splice(draggedIndex, 1);
    newLabels.splice(targetIndex, 0, draggedItem);
    
    // Aggiorna display_order
    const updatedLabels = newLabels.map((label, index) => ({
      ...label,
      display_order: index
    }));
    
    setLabels(updatedLabels);
    
    try {
      // Aggiorna tutti i display_order nel database
      const updates = updatedLabels.map(label => ({
        id: label.id,
        title: label.title,
        color: label.color,
        text_color: label.text_color,
        display_order: label.display_order,
        updated_at: new Date().toISOString()
      }));
      
      const { error } = await supabase.from("product_labels").upsert(updates);
      if (error) throw error;
    } catch (error) {
      console.error("Errore durante il riordinamento:", error);
      toast.error("Impossibile aggiornare l'ordine");
      fetchLabels(); // Ripristina l'ordine originale
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId !== targetId) {
      reorderLabels(draggedId, targetId);
    }
  };

  // Funzione per determinare il colore del testo più leggibile 
  // in base al colore dello sfondo
  const getContrastTextColor = (bgColor?: string | null) => {
    if (!bgColor) return "#000000";
    
    // Converte il colore esadecimale in RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calcola la luminosità
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Se la luminosità è alta, usa testo scuro, altrimenti chiaro
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={() => handleOpenDialog()} 
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Nuova Etichetta
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={fetchLabels}
          title="Aggiorna"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : labels.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">Nessuna etichetta trovata</p>
          <Button 
            variant="link" 
            onClick={() => handleOpenDialog()}
          >
            Crea la prima etichetta
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "50px" }}></TableHead>
              <TableHead>Titolo</TableHead>
              <TableHead>Anteprima</TableHead>
              <TableHead>Colori</TableHead>
              <TableHead style={{ width: "100px" }}>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labels.map((label) => (
              <TableRow 
                key={label.id}
                draggable
                onDragStart={(e) => handleDragStart(e, label.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, label.id)}
                className="cursor-move"
              >
                <TableCell>
                  <div className="flex justify-center">
                    <GripVertical size={16} className="text-gray-400" />
                  </div>
                </TableCell>
                <TableCell>{label.title}</TableCell>
                <TableCell>
                  <Badge
                    className="font-normal"
                    style={{
                      backgroundColor: label.color || "#e2e8f0",
                      color: label.text_color || getContrastTextColor(label.color),
                    }}
                  >
                    {label.title}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {label.color && (
                      <div 
                        className="h-5 w-5 rounded-full" 
                        style={{ backgroundColor: label.color }}
                      />
                    )}
                    <span className="text-xs">
                      {label.color || 'Nessun colore'} 
                      {label.text_color && <span> / {label.text_color}</span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(label)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteLabel(label.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog per creare/modificare etichette */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Badge
                  className="font-normal text-sm"
                  style={{
                    backgroundColor: currentLabel.color || "#e2e8f0",
                    color: currentLabel.text_color || getContrastTextColor(currentLabel.color),
                  }}
                >
                  {currentLabel.title || "Anteprima Etichetta"}
                </Badge>
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
              onClick={() => setIsDialogOpen(false)}
            >
              <X size={16} className="mr-2" /> Annulla
            </Button>
            <Button 
              onClick={handleSaveLabel}
            >
              <Check size={16} className="mr-2" /> 
              {isEditing ? "Aggiorna" : "Salva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductLabelsManager;
