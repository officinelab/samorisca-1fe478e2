
import React from 'react';
import { Category } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { getElementStyle } from '../utils/styleUtils';

interface RepeatedCategoryTitleProps {
  category: Category;
  language: string;
  customLayout?: PrintLayout | null;
  isRepeated?: boolean;
}

const RepeatedCategoryTitle: React.FC<RepeatedCategoryTitleProps> = ({
  category,
  language,
  customLayout,
  isRepeated = false
}) => {
  // Se non c'è un layout personalizzato o se la categoria non è visibile, non mostrare nulla
  if (!customLayout || !customLayout.elements.category.visible) {
    return null;
  }
  
  // Ottieni lo stile base per il titolo della categoria
  const baseStyle = getElementStyle(customLayout.elements.category, {
    marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  });
  
  // Se si tratta di un titolo ripetuto, applica uno stile diverso
  const titleStyle = isRepeated 
    ? {
        ...baseStyle,
        fontStyle: 'italic',
        borderBottom: '1px dashed #999',
        paddingBottom: '2px',
        marginTop: '0',
        fontSize: `${(customLayout.elements.category.fontSize - 2)}pt`, // Leggermente più piccolo
        color: '#555', // Colore più chiaro per indicare che è un titolo ripetuto
      }
    : baseStyle;

  return (
    <h2 
      style={titleStyle} 
      className={isRepeated ? "category-title repeated-category-title" : "category-title"}
    >
      {isRepeated ? `${category[`title_${language}`] || category.title} (cont.)` : category[`title_${language}`] || category.title}
    </h2>
  );
};

export default RepeatedCategoryTitle;
