
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface CoverLayoutTabProps {
  layout: PrintLayout;
  onCoverLogoChange: (field: string, value: any) => void;
  onCoverTitleChange: (field: string, value: any) => void;
  onCoverTitleMarginChange: (marginKey: string, value: number) => void;
  onCoverSubtitleChange: (field: string, value: any) => void;
  onCoverSubtitleMarginChange: (marginKey: string, value: number) => void;
}

const CoverLayoutTab: React.FC<CoverLayoutTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Layout Copertina</h3>
      <p>Configurazioni copertina del layout (da implementare)</p>
    </div>
  );
};

export default CoverLayoutTab;
