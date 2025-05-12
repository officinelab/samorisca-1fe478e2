
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyFeatureStateProps {
  onAddNew: () => void;
}

export const EmptyFeatureState: React.FC<EmptyFeatureStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center py-8 border rounded-lg">
      <p className="text-muted-foreground">Nessuna caratteristica trovata</p>
      <Button 
        variant="link" 
        onClick={onAddNew}
      >
        Crea la prima caratteristica
      </Button>
    </div>
  );
};

export default EmptyFeatureState;
