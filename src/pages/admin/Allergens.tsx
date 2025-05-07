
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Move, Save, X, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Tipo per gli allergeni
interface Allergen {
  id: string;
  number: number;
  title: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
}

const Allergens = () => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAllergen, setEditingAllergen] = useState<Allergen | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderingList, setReorderingList] = useState<Allergen[]>([]);

  // Carica gli allergeni
  useEffect(() => {
    const fetchAllergens = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('allergens')
          .select('*')
          .order('display_order', { ascending: true }) as { data: Allergen[] | null; error: any };
        
        if (error) throw error;
        
        setAllergens(data || []);
      } catch (error) {
        console.error('Errore nel recupero degli allergeni:', error);
        toast.error("Non è stato possibile caricare gli allergeni. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllergens();
  }, []);

  // Aggiunge un nuovo allergene
  const handleAddAllergen = async (allergenData: Partial<Allergen>) => {
    try {
      // Trova il numero massimo attuale e incrementa di 1
      const maxNumber = Math.max(...allergens.map(a => a.number), 0);
      const nextNumber = maxNumber + 1;
      
      // Determina il prossimo display_order
      const maxOrder = Math.max(...allergens.map(a => a.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      const { data, error } = await supabase
        .from('allergens')
        .insert([{ 
          ...allergenData, 
          number: allergenData.number || nextNumber,
          display_order: nextOrder
        }])
        .select() as { data: Allergen[] | null; error: any };
      
      if (error) throw error;
      
      if (data) {
        setAllergens([...allergens, data[0]]);
        toast.success("Allergene aggiunto con successo!");
      }
    } catch (error) {
      console.error('Errore nell\'aggiunta dell\'allergene:', error);
      toast.error("Errore nell'aggiunta dell'allergene. Riprova più tardi.");
    }
  };

  // Aggiorna un allergene esistente
  const handleUpdateAllergen = async (allergenId: string, allergenData: Partial<Allergen>) => {
    try {
      const { error } = await supabase
        .from('allergens')
        .update(allergenData)
        .eq('id', allergenId) as { error: any };
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setAllergens(allergens.map(a => 
        a.id === allergenId ? { ...a, ...allergenData } : a
      ));
      
      toast.success("Allergene aggiornato con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'allergene:', error);
      toast.error("Errore nell'aggiornamento dell'allergene. Riprova più tardi.");
    }
  };

  // Elimina un allergene
  const handleDeleteAllergen = async (allergenId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo allergene? Verrà rimosso da tutti i prodotti associati.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('allergens')
        .delete()
        .eq('id', allergenId) as { error: any };
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setAllergens(allergens.filter(a => a.id !== allergenId));
      toast.success("Allergene eliminato con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'allergene:', error);
      toast.error("Errore nell'eliminazione dell'allergene. Riprova più tardi.");
    }
  };

  // Riordina gli allergeni
  const handleReorderAllergens = async () => {
    try {
      // Aggiorna i numeri progressivi in base all'ordine attuale
      const updatedAllergens = reorderingList.map((allergen, index) => ({
        ...allergen,
        number: index + 1,
        display_order: index
      }));
      
      // Aggiorna nel database
      for (const allergen of updatedAllergens) {
        const { error } = await supabase
          .from('allergens')
          .update({ 
            number: allergen.number, 
            display_order: allergen.display_order 
          })
          .eq('id', allergen.id) as { error: any };
        
        if (error) throw error;
      }
      
      // Aggiorna lo stato locale
      setAllergens(updatedAllergens);
      setIsReordering(false);
      toast.success("Allergeni riordinati con successo!");
    } catch (error) {
      console.error('Errore nel riordinamento degli allergeni:', error);
      toast.error("Errore nel riordinamento degli allergeni. Riprova più tardi.");
    }
  };

  // Inizia il riordinamento
  const startReordering = () => {
    setIsReordering(true);
    setReorderingList([...allergens]);
  };

  // Annulla il riordinamento
  const cancelReordering = () => {
    setIsReordering(false);
  };

  // Sposta un allergene nella lista di riordinamento
  const moveAllergen = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === reorderingList.length - 1)
    ) {
      return;
    }

    const newList = [...reorderingList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setReorderingList(newList);
  };

  // Componente per il caricamento delle icone degli allergeni
  const IconUploader = ({ 
    currentIcon, 
    onIconUploaded 
  }: { 
    currentIcon?: string | null, 
    onIconUploaded: (url: string) => void 
  }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentIcon || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Valida il tipo di file
      if (!file.type.startsWith('image/')) {
        toast.error("Per favore seleziona un'immagine valida");
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Crea un'anteprima locale
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        // Carica l'immagine su Supabase Storage
        const filePath = `allergens/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('menu-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Ottieni l'URL pubblico dell'immagine
        const { data: publicUrlData } = supabase.storage
          .from('menu-images')
          .getPublicUrl(data.path);
        
        onIconUploaded(publicUrlData.publicUrl);
      } catch (error) {
        console.error('Errore nel caricamento dell\'icona:', error);
        toast.error("Errore nel caricamento dell'icona. Riprova più tardi.");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <Label>Icona Allergene</Label>
        {previewUrl && (
          <div className="relative w-20 h-20 mb-2">
            <img 
              src={previewUrl} 
              alt="Icon Preview" 
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        )}
        <div className="flex items-center">
          <Label 
            htmlFor="icon-upload" 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-2 w-full text-center hover:bg-gray-50"
          >
            {isUploading ? "Caricamento in corso..." : "Carica icona"}
          </Label>
          <Input 
            id="icon-upload" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>
    );
  };

  // Form per l'aggiunta/modifica di un allergene
  const AllergenForm = ({ 
    initialData, 
    onSubmit,
    onCancel 
  }: { 
    initialData?: Allergen, 
    onSubmit: (data: Partial<Allergen>) => void,
    onCancel: () => void 
  }) => {
    const [number, setNumber] = useState(initialData?.number?.toString() || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [iconUrl, setIconUrl] = useState<string | null>(initialData?.icon_url || null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        number: number ? parseInt(number) : undefined,
        title,
        description: description || null,
        icon_url: iconUrl
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="number">Numero</Label>
          <Input 
            id="number"
            type="number"
            min="1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Numero identificativo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Titolo</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome dell'allergene"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrizione</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione dell'allergene"
            rows={3}
          />
        </div>
        
        <IconUploader 
          currentIcon={iconUrl} 
          onIconUploaded={setIconUrl} 
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
          <Button type="submit">Salva</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tabella Allergeni</h1>
        {isReordering ? (
          <div className="flex space-x-2">
            <Button onClick={cancelReordering} variant="outline">
              <X className="h-4 w-4 mr-1" /> Annulla
            </Button>
            <Button onClick={handleReorderAllergens} variant="default">
              <Save className="h-4 w-4 mr-1" /> Salva
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={startReordering} variant="outline">
              <Move className="h-4 w-4 mr-1" /> Riordina
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-1" /> Aggiungi
            </Button>
          </div>
        )}
      </div>

      <p className="text-gray-600">
        Gestisci l'elenco degli allergeni che possono essere associati ai prodotti del menu.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isReordering ? (
          // Modalità riordinamento
          reorderingList.map((allergen, index) => (
            <div 
              key={allergen.id}
              className="flex items-center justify-between bg-white p-3 rounded-md border"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{allergen.number}</span>
                <span className="font-medium">{allergen.title}</span>
              </div>
              <div className="flex space-x-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => moveAllergen(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => moveAllergen(index, 'down')}
                  disabled={index === reorderingList.length - 1}
                >
                  ↓
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Visualizzazione normale degli allergeni
          allergens.map((allergen) => (
            <Card key={allergen.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold">
                        {allergen.number}
                      </span>
                      <div>
                        <h3 className="font-medium">{allergen.title}</h3>
                        {allergen.description && (
                          <p className="text-sm text-gray-500">{allergen.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setEditingAllergen(allergen)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDeleteAllergen(allergen.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Mostra l'icona se presente */}
                  {allergen.icon_url && (
                    <div className="mt-3 flex justify-start">
                      <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden">
                        <img 
                          src={allergen.icon_url}
                          alt={`Icona per ${allergen.title}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {allergens.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-lg font-medium">Nessun allergene trovato</p>
            <p className="mt-1">Aggiungi il primo allergene per iniziare.</p>
          </div>
        )}

        {isLoading && (
          <>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </>
        )}
      </div>

      {/* Dialog per aggiungere un allergene */}
      <Dialog 
        open={showAddDialog} 
        onOpenChange={(open) => !open && setShowAddDialog(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Allergene</DialogTitle>
          </DialogHeader>
          <AllergenForm 
            onSubmit={(data) => {
              handleAddAllergen(data);
              setShowAddDialog(false);
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog per modificare un allergene */}
      <Dialog 
        open={!!editingAllergen} 
        onOpenChange={(open) => !open && setEditingAllergen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Allergene</DialogTitle>
          </DialogHeader>
          {editingAllergen && (
            <AllergenForm 
              initialData={editingAllergen}
              onSubmit={(data) => {
                handleUpdateAllergen(editingAllergen.id, data);
                setEditingAllergen(null);
              }}
              onCancel={() => setEditingAllergen(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Allergens;
