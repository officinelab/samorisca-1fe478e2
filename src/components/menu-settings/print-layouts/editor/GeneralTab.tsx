
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface GeneralTabProps {
  layout: PrintLayout;
  onGeneralChange: (field: string, value: any) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ layout, onGeneralChange }) => {
  return (
    <div className="space-y-4">
      <h3>Impostazioni Generali</h3>
      <p>Configurazioni generali del layout (da implementare)</p>
    </div>
  );
};

export default GeneralTab;
