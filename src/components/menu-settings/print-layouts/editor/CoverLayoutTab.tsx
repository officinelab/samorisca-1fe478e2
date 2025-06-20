
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface CoverLayoutTabProps {
  layout: PrintLayout;
  cover: any;
  onLogoChange: (field: string, value: any) => void;
  onTitleChange: (field: string, value: any) => void;
  onTitleMarginChange: (side: string, value: number) => void;
  onSubtitleChange: (field: string, value: any) => void;
  onSubtitleMarginChange: (side: string, value: number) => void;
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
