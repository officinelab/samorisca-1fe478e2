
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2, Move, Save, X } from "lucide-react";
import { useAllergensManager } from "@/hooks/useAllergensManager";
import AllergenForm from "@/components/allergens/AllergenForm";
import AllergenCard from "@/components/allergens/AllergenCard";
import ReorderingItem from "@/components/allergens/ReorderingItem";
import EmptyState from "@/components/allergens/EmptyState";

const Allergens = () => {
  const {
    allergens,
    isLoading,
    showAddDialog,
    setShowAddDialog,
    editingAllergen,
    setEditingAllergen,
    isReordering,
    reorderingList,
    handleAddAllergen,
    handleUpdateAllergen,
    handleDeleteAllergen,
    handleReorderAllergens,
    startReordering,
    cancelReordering,
    moveAllergen
  } = useAllergensManager();

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

      {/* Contenitore principale degli allergeni */}
      <div className="flex flex-col space-y-4">
        {isReordering ? (
          // Modalità riordinamento
          reorderingList.map((allergen, index) => (
            <ReorderingItem
              key={allergen.id}
              allergen={allergen}
              index={index}
              totalItems={reorderingList.length}
              onMove={moveAllergen}
            />
          ))
        ) : (
          // Visualizzazione normale degli allergeni in colonna singola
          allergens.map((allergen) => (
            <AllergenCard
              key={allergen.id}
              allergen={allergen}
              onEdit={setEditingAllergen}
              onDelete={handleDeleteAllergen}
            />
          ))
        )}

        {allergens.length === 0 && !isLoading && <EmptyState />}

        {isLoading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
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
