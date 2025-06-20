
import React from 'react';
import { CategoryNotesConfig } from '@/types/printLayout';

interface CategoryNotesTabProps {
  categoryNotes: CategoryNotesConfig;
  onIconChange: (field: string, value: any) => void;
  onTitleChange: (field: string, value: any) => void;
  onTitleMarginChange: (side: string, value: number) => void;
  onTextChange: (field: string, value: any) => void;
  onTextMarginChange: (side: string, value: number) => void;
}

const CategoryNotesTab: React.FC<CategoryNotesTabProps> = ({ categoryNotes }) => {
  return (
    <div className="space-y-4">
      <h3>Note Categorie</h3>
      <p>Configurazioni note categorie del layout (da implementare)</p>
    </div>
  );
};

export default CategoryNotesTab;
