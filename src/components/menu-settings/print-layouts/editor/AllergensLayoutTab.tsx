
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface AllergensLayoutTabProps {
  layout: PrintLayout;
  onAllergensTitleChange: (field: string, value: any) => void;
  onAllergensTitleMarginChange: (marginKey: string, value: number) => void;
  onAllergensDescriptionChange: (field: string, value: any) => void;
  onAllergensDescriptionMarginChange: (marginKey: string, value: number) => void;
  onAllergensItemNumberChange: (field: string, value: any) => void;
  onAllergensItemNumberMarginChange: (marginKey: string, value: number) => void;
  onAllergensItemTitleChange: (field: string, value: any) => void;
  onAllergensItemTitleMarginChange: (marginKey: string, value: number) => void;
  onAllergensItemDescriptionChange: (field: string, value: any) => void;
  onAllergensItemDescriptionMarginChange: (marginKey: string, value: number) => void;
  onAllergensItemChange: (field: string, value: any) => void;
}

const AllergensLayoutTab: React.FC<AllergensLayoutTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Layout Allergeni</h3>
      <p>Configurazioni allergeni del layout (da implementare)</p>
    </div>
  );
};

export default AllergensLayoutTab;
