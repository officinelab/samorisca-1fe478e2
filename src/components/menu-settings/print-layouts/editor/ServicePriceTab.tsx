
import React from 'react';
import { PrintLayoutElementConfig } from '@/types/printLayout';

interface ServicePriceTabProps {
  servicePrice: PrintLayoutElementConfig;
  onServicePriceChange: (field: string, value: any) => void;
  onServicePriceMarginChange: (side: string, value: number) => void;
}

const ServicePriceTab: React.FC<ServicePriceTabProps> = ({ servicePrice }) => {
  return (
    <div className="space-y-4">
      <h3>Prezzo Servizio</h3>
      <p>Configurazioni prezzo servizio del layout (da implementare)</p>
    </div>
  );
};

export default ServicePriceTab;
