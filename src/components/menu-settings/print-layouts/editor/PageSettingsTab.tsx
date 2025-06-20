
import React from 'react';
import { PrintLayoutPageConfig } from '@/types/printLayout';

interface PageSettingsTabProps {
  page: PrintLayoutPageConfig;
  onPageMarginChange: (side: string, value: number) => void;
  onOddPageMarginChange: (side: string, value: number) => void;
  onEvenPageMarginChange: (side: string, value: number) => void;
  onToggleDistinctMargins: (enabled: boolean) => void;
  onCoverMarginChange: (side: string, value: number) => void;
  onAllergensMarginChange: (side: string, value: number) => void;
  onAllergensOddPageMarginChange: (side: string, value: number) => void;
  onAllergensEvenPageMarginChange: (side: string, value: number) => void;
  onToggleDistinctAllergensMargins: (enabled: boolean) => void;
}

const PageSettingsTab: React.FC<PageSettingsTabProps> = ({ page }) => {
  return (
    <div className="space-y-4">
      <h3>Impostazioni Pagina</h3>
      <p>Configurazioni pagina del layout (da implementare)</p>
    </div>
  );
};

export default PageSettingsTab;
