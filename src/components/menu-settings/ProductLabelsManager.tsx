
import { useEffect } from "react";
import { LabelsTable } from "./product-labels/LabelsTable";
import { LabelFormDialog } from "./product-labels/LabelFormDialog";
import { useProductLabels } from "@/hooks/menu-settings/useProductLabels";

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

  return (
    <div>
      <LabelsTable 
        labels={labels}
        isLoading={isLoading}
        onAddLabel={() => handleOpenDialog()}
        onEditLabel={handleOpenDialog}
        onDeleteLabel={handleDeleteLabel}
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
    </div>
  );
};

export default ProductLabelsManager;
