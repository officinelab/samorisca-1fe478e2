
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface SpacingTabProps {
  layout: PrintLayout;
  onSpacingChange: (field: string, value: number) => void;
}

const SpacingTab: React.FC<SpacingTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Spaziatura</h3>
      <p>Configurazioni spaziatura del layout (da implementare)</p>
    </div>
  );
};

export default SpacingTab;
