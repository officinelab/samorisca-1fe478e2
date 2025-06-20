
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface ServicePriceTabProps {
  layout: PrintLayout;
  servicePrice: any;
  onServicePriceChange: (field: string, value: any) => void;
  onServicePriceMarginChange: (side: string, value: number) => void;
}

const ServicePriceTab: React.FC<ServicePriceTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Prezzo Servizio</h3>
      <p>Configurazioni prezzo servizio del layout (da implementare)</p>
    </div>
  );
};

export default ServicePriceTab;
