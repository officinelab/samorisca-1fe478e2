
import React from 'react';
import { PrintLayoutCover } from '@/types/printLayout';

interface CoverLayoutTabProps {
  cover: PrintLayoutCover;
  onLogoChange: (field: string, value: any) => void;
  onTitleChange: (field: string, value: any) => void;
  onTitleMarginChange: (side: string, value: number) => void;
  onSubtitleChange: (field: string, value: any) => void;
  onSubtitleMarginChange: (side: string, value: number) => void;
}

const CoverLayoutTab: React.FC<CoverLayoutTabProps> = ({ cover }) => {
  return (
    <div className="space-y-4">
      <h3>Layout Copertina</h3>
      <p>Configurazioni copertina del layout (da implementare)</p>
    </div>
  );
};

export default CoverLayoutTab;
