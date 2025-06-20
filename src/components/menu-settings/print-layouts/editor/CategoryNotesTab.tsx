
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

interface CategoryNotesTabProps {
  layout: PrintLayout;
  onCategoryNotesIconChange: (field: string, value: number) => void;
  onCategoryNotesTitleChange: (field: string, value: any) => void;
  onCategoryNotesTitleMarginChange: (marginKey: string, value: number) => void;
  onCategoryNotesTextChange: (field: string, value: any) => void;
  onCategoryNotesTextMarginChange: (marginKey: string, value: number) => void;
}

const CategoryNotesTab: React.FC<CategoryNotesTabProps> = ({ layout }) => {
  return (
    <div className="space-y-4">
      <h3>Note Categorie</h3>
      <p>Configurazioni note categorie del layout (da implementare)</p>
    </div>
  );
};

export default CategoryNotesTab;
