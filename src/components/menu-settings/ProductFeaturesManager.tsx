
import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, GripVertical, X, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductFeature {
  id: string;
  title: string;
  icon_url?: string | null;
  display_order: number;
}

const ProductFeaturesManager = () => {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<Partial<ProductFeature>>({});

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_features")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error("Errore nel caricamento delle caratteristiche:", error);
      toast.error("Impossibile caricare le caratteristiche");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleOpenDialog = (feature?: ProductFeature) => {
    if (feature) {
      setCurrentFeature(feature);
      setIsEditing(true);
    } else {
      setCurrentFeature({});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveFeature = async () => {
    if (!currentFeature.title) {
      toast.error("Il titolo è obbligatorio");
      return;
    }

    try {
      if (isEditing && currentFeature.id) {
        const { error } = await supabase
          .from("product_features")
          .update({
            title: currentFeature.title,
            icon_url: currentFeature.icon_url,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentFeature.id);

        if (error) throw error;
        toast.success("Caratteristica aggiornata con successo");
      } else {
        const maxOrder = features.length > 0 
          ? Math.max(...features.map(f => f.display_order)) + 1 
          : 0;
          
        const { error } = await supabase
          .from("product_features")
          .insert({
            title: currentFeature.title,
            icon_url: currentFeature.icon_url,
            display_order: maxOrder
          });

        if (error) throw error;
        toast.success("Caratteristica creata con successo");
      }

      setIsDialogOpen(false);
      fetchFeatures();
    } catch (error) {
      console.error("Errore durante il salvataggio della caratteristica:", error);
      toast.error("Impossibile salvare la caratteristica");
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa caratteristica?")) return;
    
    try {
      const { error } = await supabase
        .from("product_features")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Caratteristica eliminata con successo");
      fetchFeatures();
    } catch (error) {
      console.error("Errore durante l'eliminazione della caratteristica:", error);
      toast.error("Impossibile eliminare la caratteristica");
    }
  };

  const reorderFeatures = async (draggedId: string, targetId: string) => {
    const draggedIndex = features.findIndex(feature => feature.id === draggedId);
    const targetIndex = features.findIndex(feature => feature.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newFeatures = [...features];
    const [draggedItem] = newFeatures.splice(draggedIndex, 1);
    newFeatures.splice(targetIndex, 0, draggedItem);
    
    // Aggiorna display_order
    const updatedFeatures = newFeatures.map((feature, index) => ({
      ...feature,
      display_order: index
    }));
    
    setFeatures(updatedFeatures);
    
    try {
      // Aggiorna tutti i display_order nel database
      // CORREZIONE: Includi tutti i campi necessari incluso il titolo
      const updates = updatedFeatures.map(feature => ({
        id: feature.id,
        title: feature.title,
        icon_url: feature.icon_url,
        display_order: feature.display_order,
        updated_at: new Date().toISOString()
      }));
      
      const { error } = await supabase.from("product_features").upsert(updates);
      if (error) throw error;
    } catch (error) {
      console.error("Errore durante il riordinamento:", error);
      toast.error("Impossibile aggiornare l'ordine");
      fetchFeatures(); // Ripristina l'ordine originale
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
      reorderFeatures(draggedId, targetId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={() => handleOpenDialog()} 
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Nuova Caratteristica
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={fetchFeatures}
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
      ) : features.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">Nessuna caratteristica trovata</p>
          <Button 
            variant="link" 
            onClick={() => handleOpenDialog()}
          >
            Crea la prima caratteristica
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "50px" }}></TableHead>
              <TableHead>Titolo</TableHead>
              <TableHead>Icona</TableHead>
              <TableHead style={{ width: "100px" }}>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow 
                key={feature.id}
                draggable
                onDragStart={(e) => handleDragStart(e, feature.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, feature.id)}
                className="cursor-move"
              >
                <TableCell>
                  <div className="flex justify-center">
                    <GripVertical size={16} className="text-gray-400" />
                  </div>
                </TableCell>
                <TableCell>{feature.title}</TableCell>
                <TableCell>
                  {feature.icon_url ? (
                    <div className="flex items-center">
                      <img 
                        src={feature.icon_url} 
                        alt={feature.title}
                        className="h-6 w-6 object-contain mr-2"
                      />
                      <span className="text-xs text-muted-foreground overflow-hidden text-ellipsis max-w-[150px]">
                        {feature.icon_url}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Nessuna icona</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenDialog(feature)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteFeature(feature.id)}
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

      {/* Dialog per creare/modificare caratteristiche */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifica Caratteristica" : "Nuova Caratteristica"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifica i dettagli della caratteristica selezionata." 
                : "Inserisci i dettagli per la nuova caratteristica."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titolo *
              </label>
              <Input
                id="title"
                value={currentFeature.title || ''}
                onChange={(e) => setCurrentFeature({...currentFeature, title: e.target.value})}
                placeholder="Nome della caratteristica"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="icon_url" className="text-sm font-medium">
                URL Icona (opzionale)
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  id="icon_url"
                  value={currentFeature.icon_url || ''}
                  onChange={(e) => setCurrentFeature({...currentFeature, icon_url: e.target.value})}
                  placeholder="URL dell'icona"
                />
                {currentFeature.icon_url && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCurrentFeature({...currentFeature, icon_url: null})}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
              {currentFeature.icon_url && (
                <div className="mt-2 flex items-center border p-2 rounded">
                  <img 
                    src={currentFeature.icon_url} 
                    alt="Anteprima icona"
                    className="h-10 w-10 object-contain mr-3" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Anteprima icona</span>
                </div>
              )}
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
              onClick={handleSaveFeature}
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

export default ProductFeaturesManager;
