
import React from 'react';
import { MenuSpacing } from '@/types/printLayout';

interface SpacingTabProps {
  spacing: MenuSpacing;
  onSpacingChange: (field: string, value: number) => void;
}

const SpacingTab: React.FC<SpacingTabProps> = ({ spacing }) => {
  return (
    <div className="space-y-4">
      <h3>Spaziatura</h3>
      <p>Configurazioni spaziatura del layout (da implementare)</p>
    </div>
  );
};

export default SpacingTab;
