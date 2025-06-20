
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface PageSettingsTabProps {
  layout: PrintLayout;
  onPageMarginChange: (field: string, value: number) => void;
  onOddPageMarginChange: (field: string, value: number) => void;
  onEvenPageMarginChange: (field: string, value: number) => void;
  onToggleDistinctMargins: () => void;
  onCoverMarginChange: (field: string, value: number) => void;
  onAllergensMarginChange: (field: string, value: number) => void;
  onAllergensOddPageMarginChange: (field: string, value: number) => void;
  onAllergensEvenPageMarginChange: (field: string, value: number) => void;
  onToggleDistinctAllergensMargins: (useDistinct: boolean) => void;
}

const PageSettingsTab: React.FC<PageSettingsTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Impostazioni Pagina</h3>
      <p>Configurazioni pagina del layout (da implementare)</p>
    </div>
  );
};

export default PageSettingsTab;
