
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductActionButtonsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  isSubmitting,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annulla
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio..." : "Salva"}
      </Button>
    </div>
  );
};

export default ProductActionButtons;
