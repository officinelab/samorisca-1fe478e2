
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface ProductDetailHeaderProps {
  title: string;
  onBackToProducts?: () => void;
  isMobile?: boolean;
  showActions: boolean;
  onEdit?: () => void;
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  title,
  onBackToProducts,
  isMobile = false,
  showActions,
  onEdit
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        {isMobile && onBackToProducts && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={onBackToProducts}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      
      {showActions && onEdit && (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" /> Modifica
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailHeader;
