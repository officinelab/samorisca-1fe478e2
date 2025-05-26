
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";

interface ProductDetailHeaderProps {
  onEditProduct: () => void;
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  onEditProduct
}) => {
  return (
    <div className={dashboardStyles.detailHeader}>
      <h2 className={dashboardStyles.detailTitle}>Dettagli Prodotto</h2>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          onClick={onEditProduct}
        >
          <Edit className="h-4 w-4 mr-2" /> Modifica
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
