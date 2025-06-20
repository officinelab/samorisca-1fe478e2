
import React from 'react';
import { ProductFeaturesConfig } from '@/types/printLayout';

interface ProductFeaturesTabProps {
  productFeatures: ProductFeaturesConfig;
  onProductFeaturesChange: (field: string, value: any) => void;
  onIconChange: (field: string, value: any) => void;
  onTitleChange: (field: string, value: any) => void;
  onTitleMarginChange: (side: string, value: number) => void;
}

const ProductFeaturesTab: React.FC<ProductFeaturesTabProps> = ({ productFeatures }) => {
  return (
    <div className="space-y-4">
      <h3>Caratteristiche Prodotto</h3>
      <p>Configurazioni caratteristiche prodotto del layout (da implementare)</p>
    </div>
  );
};

export default ProductFeaturesTab;
