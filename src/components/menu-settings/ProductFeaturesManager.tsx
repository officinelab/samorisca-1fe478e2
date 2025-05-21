import React, { useState } from "react";
import useProductFeatureManager from "./product-features/hooks/useProductFeatureManager";
import FeaturesToolbar from "./product-features/FeaturesToolbar";
import FeaturesTable from "./product-features/FeaturesTable";
import FeatureFormDialog from "./product-features/FeatureFormDialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogDescription } from "@/components/ui/alert-dialog";

const ProductFeaturesManager = () => {
  const {
    features,
    isLoading,
    isDialogOpen,
    currentFeature,
    isEditing,
    fetchFeatures,
    handleOpenDialog,
    handleCloseDialog,
    handleSaveFeature,
    handleDeleteFeature,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useProductFeatureManager();

  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  const handleDeleteClicked = (id: string) => {
    setFeatureToDelete(id);
  };

  const confirmDeleteFeature = async () => {
    if (featureToDelete) {
      await handleDeleteFeature(featureToDelete);
      setFeatureToDelete(null);
    }
  };

  return (
    <div>
      <FeaturesToolbar 
        onAddNew={() => handleOpenDialog()} 
        onRefresh={fetchFeatures} 
      />

      <FeaturesTable 
        features={features}
        isLoading={isLoading}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteClicked}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <FeatureFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveFeature}
        feature={currentFeature}
        isEditing={isEditing}
      />

      {/* Popup conferma cancellazione caratteristica */}
      <AlertDialog open={!!featureToDelete} onOpenChange={open => !open && setFeatureToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler rimuovere questa caratteristica?</AlertDialogTitle>
            <AlertDialogDescription>La caratteristica verrà rimossa dal sistema.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFeature}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductFeaturesManager;
