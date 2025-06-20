
import React from 'react';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';

interface CategoryRendererProps {
  category: Category;
  notes: CategoryNote[];
  layout: PrintLayout;
  isRepeatedTitle?: boolean;
}

const CategoryRenderer: React.FC<CategoryRendererProps> = ({
  category,
  notes,
  layout,
  isRepeatedTitle = false
}) => {
  if (isRepeatedTitle) {
    return null; // Non mostrare nulla se è un titolo ripetuto
  }

  return (
    <div className="category-section">
      {/* Category Title */}
      <div
        className="category-title"
        style={{
          fontSize: `${layout.elements.category.fontSize}pt`,
          fontFamily: layout.elements.category.fontFamily,
          color: layout.elements.category.fontColor,
          fontWeight: layout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: layout.elements.category.alignment as any,
          marginTop: `${layout.elements.category.margin.top}mm`,
          marginRight: `${layout.elements.category.margin.right}mm`,
          marginBottom: `${layout.elements.category.margin.bottom}mm`,
          marginLeft: `${layout.elements.category.margin.left}mm`,
        }}
      >
        {category.title}
      </div>

      {/* Category Notes */}
      {notes.length > 0 && (
        <div className="category-notes space-y-1">
          {notes.map((note) => (
            <div key={note.id} className="category-note flex items-start gap-2">
              {/* Note Icon */}
              {note.icon_url && (
                <img 
                  src={note.icon_url}
                  alt={note.title}
                  style={{
                    width: `${layout.categoryNotes.icon.iconSize}px`,
                    height: `${layout.categoryNotes.icon.iconSize}px`,
                    flexShrink: 0
                  }}
                />
              )}
              
              <div className="note-content flex-1">
                {/* Note Title */}
                <div
                  className="note-title"
                  style={{
                    fontSize: `${layout.categoryNotes.title.fontSize}pt`,
                    fontFamily: layout.categoryNotes.title.fontFamily,
                    color: layout.categoryNotes.title.fontColor,
                    fontWeight: layout.categoryNotes.title.fontStyle === 'bold' ? 'bold' : 'normal',
                    fontStyle: layout.categoryNotes.title.fontStyle === 'italic' ? 'italic' : 'normal',
                    textAlign: layout.categoryNotes.title.alignment as any,
                    marginTop: `${layout.categoryNotes.title.margin.top}mm`,
                    marginRight: `${layout.categoryNotes.title.margin.right}mm`,
                    marginBottom: `${layout.categoryNotes.title.margin.bottom}mm`,
                    marginLeft: `${layout.categoryNotes.title.margin.left}mm`,
                  }}
                >
                  {note.title}
                </div>

                {/* Note Text */}
                <div
                  className="note-text"
                  style={{
                    fontSize: `${layout.categoryNotes.text.fontSize}pt`,
                    fontFamily: layout.categoryNotes.text.fontFamily,
                    color: layout.categoryNotes.text.fontColor,
                    fontWeight: layout.categoryNotes.text.fontStyle === 'bold' ? 'bold' : 'normal',
                    fontStyle: layout.categoryNotes.text.fontStyle === 'italic' ? 'italic' : 'normal',
                    textAlign: layout.categoryNotes.text.alignment as any,
                    marginTop: `${layout.categoryNotes.text.margin.top}mm`,
                    marginRight: `${layout.categoryNotes.text.margin.right}mm`,
                    marginBottom: `${layout.categoryNotes.text.margin.bottom}mm`,
                    marginLeft: `${layout.categoryNotes.text.margin.left}mm`,
                  }}
                >
                  {note.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryRenderer;
