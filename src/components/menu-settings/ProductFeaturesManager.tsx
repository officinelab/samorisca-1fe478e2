
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import useProductFeatureManager from "./product-features/hooks/useProductFeatureManager";
import FeatureRow from "./product-features/FeatureRow";
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
              <FeatureRow 
                key={feature.id}
                feature={feature}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteFeature}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </TableBody>
        </Table>
      )}

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
