
import React from 'react';
import { CategoryNote } from "@/types/categoryNotes";

interface CategoryNoteItemProps {
  note: CategoryNote;
  deviceView: 'mobile' | 'desktop';
}

export const CategoryNoteItem: React.FC<CategoryNoteItemProps> = ({
  note,
  deviceView
}) => {
  // Usa i campi tradotti se disponibili, altrimenti fallback ai campi originali
  const displayTitle = note.displayTitle || note.title;
  const displayText = note.displayText || note.text;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${deviceView === 'mobile' ? 'mx-2' : ''}`}>
      <div className="flex items-start gap-3">
        {note.icon_url && (
          <img 
            src={note.icon_url} 
            alt="" 
            className="w-6 h-6 object-contain flex-shrink-0 mt-0.5"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-blue-900 mb-1">{displayTitle}</h4>
          <p className="text-sm text-blue-800">{displayText}</p>
        </div>
      </div>
    </div>
  );
};
