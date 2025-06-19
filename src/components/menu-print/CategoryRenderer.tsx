
import React from 'react';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';

interface CategoryRendererProps {
  category: Category;
  notes: CategoryNote[];
  layout: PrintLayout;
  isRepeatedTitle: boolean;
}

const CategoryRenderer: React.FC<CategoryRendererProps> = ({
  category,
  notes,
  layout,
  isRepeatedTitle
}) => {
  const categoryConfig = layout.elements.category;
  const categoryNotesConfig = layout.categoryNotes;

  return (
    <div className="category-section">
      {/* Category Title */}
      <div 
        className="category-title"
        style={{
          fontSize: `${categoryConfig.fontSize}pt`,
          fontFamily: categoryConfig.fontFamily,
          color: categoryConfig.fontColor,
          fontWeight: categoryConfig.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: categoryConfig.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: categoryConfig.alignment as any,
          textTransform: 'uppercase',
          marginTop: `${categoryConfig.margin.top}mm`,
          marginRight: `${categoryConfig.margin.right}mm`,
          marginBottom: `${layout.spacing.categoryTitleBottomMargin}mm`,
          marginLeft: `${categoryConfig.margin.left}mm`,
        }}
      >
        {category.title}
        {isRepeatedTitle && (
          <span className="text-xs ml-2 opacity-60">(continua)</span>
        )}
      </div>

      {/* Category Notes */}
      {notes.length > 0 && (
        <div className="category-notes space-y-2 mb-4">
          {notes.map((note) => (
            <div key={note.id} className="category-note flex items-start gap-2">
              {/* Note Icon */}
              {note.icon_url && (
                <img
                  src={note.icon_url}
                  alt="Nota"
                  className="flex-shrink-0"
                  style={{
                    width: `${categoryNotesConfig.icon.iconSize}px`,
                    height: `${categoryNotesConfig.icon.iconSize}px`,
                  }}
                />
              )}
              
              <div className="flex-1">
                {/* Note Title */}
                {categoryNotesConfig.title.visible && (
                  <div
                    className="note-title"
                    style={{
                      fontSize: `${categoryNotesConfig.title.fontSize}pt`,
                      fontFamily: categoryNotesConfig.title.fontFamily,
                      color: categoryNotesConfig.title.fontColor,
                      fontWeight: categoryNotesConfig.title.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: categoryNotesConfig.title.fontStyle === 'italic' ? 'italic' : 'normal',
                      textAlign: categoryNotesConfig.title.alignment as any,
                      marginTop: `${categoryNotesConfig.title.margin.top}mm`,
                      marginRight: `${categoryNotesConfig.title.margin.right}mm`,
                      marginBottom: `${categoryNotesConfig.title.margin.bottom}mm`,
                      marginLeft: `${categoryNotesConfig.title.margin.left}mm`,
                    }}
                  >
                    {note.title}
                  </div>
                )}

                {/* Note Text */}
                {categoryNotesConfig.text.visible && (
                  <div
                    className="note-text"
                    style={{
                      fontSize: `${categoryNotesConfig.text.fontSize}pt`,
                      fontFamily: categoryNotesConfig.text.fontFamily,
                      color: categoryNotesConfig.text.fontColor,
                      fontWeight: categoryNotesConfig.text.fontStyle === 'bold' ? 'bold' : 'normal',
                      fontStyle: categoryNotesConfig.text.fontStyle === 'italic' ? 'italic' : 'normal',
                      textAlign: categoryNotesConfig.text.alignment as any,
                      marginTop: `${categoryNotesConfig.text.margin.top}mm`,
                      marginRight: `${categoryNotesConfig.text.margin.right}mm`,
                      marginBottom: `${categoryNotesConfig.text.margin.bottom}mm`,
                      marginLeft: `${categoryNotesConfig.text.margin.left}mm`,
                    }}
                  >
                    {note.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryRenderer;
