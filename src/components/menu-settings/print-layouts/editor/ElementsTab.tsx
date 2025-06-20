
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface ElementsTabProps {
  layout: PrintLayout;
  elements: any;
  onElementChange: (element: string, field: string, value: any) => void;
  onElementMarginChange: (element: string, side: string, value: number) => void;
}

const ElementsTab: React.FC<ElementsTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Elementi del Menu</h3>
      <p>Configurazioni elementi del layout (da implementare)</p>
    </div>
  );
};

export default ElementsTab;
