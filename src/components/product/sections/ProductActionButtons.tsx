
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
    <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-end gap-4">
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
    </div>
  );
};

export default ProductActionButtons;
