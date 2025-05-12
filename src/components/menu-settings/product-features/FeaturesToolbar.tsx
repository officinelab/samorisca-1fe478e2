
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface FeaturesToolbarProps {
  onAddNew: () => void;
  onRefresh: () => void;
}

export const FeaturesToolbar: React.FC<FeaturesToolbarProps> = ({
  onAddNew,
  onRefresh
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button 
        onClick={onAddNew} 
        className="flex items-center gap-2"
      >
        <Plus size={16} /> Nuova Caratteristica
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh}
        title="Aggiorna"
      >
        <RefreshCw size={18} />
      </Button>
    </div>
  );
};

export default FeaturesToolbar;
