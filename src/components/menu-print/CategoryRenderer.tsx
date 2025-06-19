
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { getStandardizedDimensions } from '@/hooks/print/pdf/utils/conversionUtils';

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
  const dimensions = getStandardizedDimensions(layout);
  
  console.log('🏷️ CategoryRenderer - Dimensioni standardizzate per categoria:', category.title, {
    categoryFontSize: dimensions.css.categoryFontSize,
    categoryMargins: dimensions.cssMargins.category,
    hasNotes: notes.length > 0,
    isRepeated: isRepeatedTitle
  });

  // Non mostrare nulla se è un titolo ripetuto
  if (isRepeatedTitle) {
    return null;
  }

  return (
    <div className="category-section">
      {/* Titolo categoria */}
      <div
        className="category-title"
        style={{
          fontSize: `${dimensions.css.categoryFontSize}px`,
          fontFamily: layout.elements.category.fontFamily,
          color: layout.elements.category.fontColor,
          fontWeight: layout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
          fontStyle: layout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
          textAlign: layout.elements.category.alignment as any,
          marginTop: `${dimensions.cssMargins.category.top}px`,
          marginBottom: `${dimensions.spacing.categoryTitleBottomMargin}mm`,
          marginLeft: `${dimensions.cssMargins.category.left}px`,
          marginRight: `${dimensions.cssMargins.category.right}px`,
          lineHeight: 1.3,
          textTransform: 'uppercase'
        }}
      >
        {category.title}
      </div>

      {/* Note della categoria */}
      {notes && notes.length > 0 && (
        <div className="category-notes" style={{ marginBottom: '5mm' }}>
          {notes.map((note, index) => (
            <div key={note.id} className="category-note" style={{ marginBottom: index < notes.length - 1 ? '3mm' : '0' }}>
              {/* Titolo della nota */}
              <div
                className="note-title"
                style={{
                  fontSize: `${dimensions.css.categoryFontSize * 0.9}px`, // Leggermente più piccolo del titolo categoria
                  fontFamily: layout.categoryNotes.title.fontFamily,
                  color: layout.categoryNotes.title.fontColor,
                  fontWeight: layout.categoryNotes.title.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: layout.categoryNotes.title.fontStyle === 'italic' ? 'italic' : 'normal',
                  textAlign: layout.categoryNotes.title.alignment as any,
                  marginBottom: `${layout.categoryNotes.title.margin.bottom}mm`,
                  lineHeight: 1.4
                }}
              >
                {note.title}
              </div>

              {/* Testo della nota */}
              <div
                className="note-text"
                style={{
                  fontSize: `${dimensions.css.descriptionFontSize * 0.95}px`, // Simile alla descrizione prodotto
                  fontFamily: layout.categoryNotes.text.fontFamily,
                  color: layout.categoryNotes.text.fontColor,
                  fontWeight: layout.categoryNotes.text.fontStyle === 'bold' ? 'bold' : 'normal',
                  fontStyle: layout.categoryNotes.text.fontStyle === 'italic' ? 'italic' : 'normal',
                  textAlign: layout.categoryNotes.text.alignment as any,
                  lineHeight: 1.5
                }}
              >
                {note.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryRenderer;
