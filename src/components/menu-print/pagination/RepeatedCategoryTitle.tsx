
import React from 'react';
import { Category } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../utils/styleUtils';

interface RepeatedCategoryTitleProps {
  category: Category;
  language: string;
  customLayout?: PrintLayout | null;
  isRepeated: boolean;
}

const RepeatedCategoryTitle: React.FC<RepeatedCategoryTitleProps> = ({ 
  category, 
  language,
  customLayout,
  isRepeated 
}) => {
  // Stile base per il titolo della categoria
  const baseCategoryStyle = customLayout && customLayout.elements.category.visible
    ? getElementStyle(customLayout.elements.category, {
        fontWeight: 'bold',
        marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2mm',
        pageBreakAfter: 'avoid',
        pageBreakInside: 'avoid',
        breakAfter: 'avoid',
        breakInside: 'avoid',
      })
    : {
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: '5mm',
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2mm',
        pageBreakAfter: 'avoid',
        pageBreakInside: 'avoid',
        breakAfter: 'avoid',
        breakInside: 'avoid',
      };

  // Stile aggiuntivo per i titoli ripetuti (più compatti)
  const repeatedStyle: React.CSSProperties = isRepeated
    ? { 
        fontSize: customLayout?.elements.category.fontSize 
          ? `${Math.max(customLayout.elements.category.fontSize - 2, 10)}pt` 
          : '16pt',
        marginTop: '5mm',
        color: customLayout?.elements.category.fontColor || 'inherit',
        opacity: 0.9,
      }
    : {};

  // Combinare gli stili
  const categoryStyle = { ...baseCategoryStyle, ...repeatedStyle };

  return (
    <h2 
      className="category-title" 
      style={categoryStyle}
    >
      {isRepeated && (
        <span style={{ fontSize: '0.8em', opacity: 0.7, marginRight: '5px' }}>
          (continua) 
        </span>
      )}
      {category[`title_${language}`] || category.title}
    </h2>
  );
};

export default RepeatedCategoryTitle;
