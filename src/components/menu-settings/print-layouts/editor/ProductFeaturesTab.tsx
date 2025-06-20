
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface ProductFeaturesTabProps {
  layout: PrintLayout;
  onProductFeaturesIconChange: (field: string, value: number) => void;
  onProductFeaturesTitleChange: (field: string, value: any) => void;
  onProductFeaturesTitleMarginChange: (marginKey: string, value: number) => void;
}

const ProductFeaturesTab: React.FC<ProductFeaturesTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Caratteristiche Prodotto</h3>
      <p>Configurazioni caratteristiche prodotto del layout (da implementare)</p>
    </div>
  );
};

export default ProductFeaturesTab;
