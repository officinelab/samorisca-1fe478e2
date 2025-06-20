
import React from 'react';
import { AllergensConfig } from '@/types/printLayout';

interface AllergensLayoutTabProps {
  allergens: AllergensConfig;
  onTitleChange: (field: string, value: any) => void;
  onTitleMarginChange: (side: string, value: number) => void;
  onDescriptionChange: (field: string, value: any) => void;
  onDescriptionMarginChange: (side: string, value: number) => void;
  onItemNumberChange: (field: string, value: any) => void;
  onItemNumberMarginChange: (side: string, value: number) => void;
  onItemTitleChange: (field: string, value: any) => void;
  onItemTitleMarginChange: (side: string, value: number) => void;
  onItemDescriptionChange: (field: string, value: any) => void;
  onItemDescriptionMarginChange: (side: string, value: number) => void;
  onItemChange: (field: string, value: any) => void;
}

const AllergensLayoutTab: React.FC<AllergensLayoutTabProps> = ({ allergens }) => {
  return (
    <div className="space-y-4">
      <h3>Layout Allergeni</h3>
      <p>Configurazioni allergeni del layout (da implementare)</p>
    </div>
  );
};

export default AllergensLayoutTab;
