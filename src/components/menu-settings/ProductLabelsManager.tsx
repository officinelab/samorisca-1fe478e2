import { useState, useEffect } from "react";
import { LabelsTable } from "./product-labels/LabelsTable";
import { LabelFormDialog } from "./product-labels/LabelFormDialog";
import { useProductLabels } from "@/hooks/menu-settings/useProductLabels";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from "@/components/ui/alert-dialog";

const ProductLabelsManager = () => {
  const {
    labels,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentLabel,
    setCurrentLabel,
    fetchLabels,
    handleOpenDialog,
    handleSaveLabel,
    handleDeleteLabel,
    reorderLabels
  } = useProductLabels();

  const [labelToDelete, setLabelToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchLabels();
  }, []);

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

  const handleDeleteClicked = (id: string) => {
    setLabelToDelete(id);
  };

  const confirmDeleteLabel = async () => {
    if (labelToDelete) {
      await handleDeleteLabel(labelToDelete);
      setLabelToDelete(null);
    }
  };

  return (
    <div>
      <LabelsTable 
        labels={labels}
        isLoading={isLoading}
        onAddLabel={() => handleOpenDialog()}
        onEditLabel={handleOpenDialog}
        onDeleteLabel={handleDeleteClicked}
        onRefresh={fetchLabels}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <LabelFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        currentLabel={currentLabel}
        setCurrentLabel={setCurrentLabel}
        isEditing={isEditing}
        onSave={handleSaveLabel}
      />

      {/* Conferma eliminazione */}
      <AlertDialog open={!!labelToDelete} onOpenChange={open => !open && setLabelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler rimuovere questa etichetta?</AlertDialogTitle>
            <AlertDialogDescription>L'etichetta verrà rimossa definitivamente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLabel}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductLabelsManager;
