
import React from "react";
import useProductFeatureManager from "./product-features/hooks/useProductFeatureManager";
import FeaturesToolbar from "./product-features/FeaturesToolbar";
import FeaturesTable from "./product-features/FeaturesTable";
import FeatureFormDialog from "./product-features/FeatureFormDialog";

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
        onDelete={handleDeleteFeature}
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
    </div>
  );
};

export default ProductFeaturesManager;
