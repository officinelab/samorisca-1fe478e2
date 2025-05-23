
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProductFormHeaderProps {
  isEditing: boolean;
  onBack: () => void;
}

export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEditing,
  onBack,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">
        {isEditing ? "Modifica Prodotto" : "Nuovo Prodotto"}
      </h1>
    </div>
  );
};
