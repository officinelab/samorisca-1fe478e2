
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
  
  // Manteniamo lo stesso stile sia per i titoli originali che per quelli ripetuti
  const titleStyle = baseStyle;

  return (
    <h2 
      style={titleStyle} 
      className={isRepeated ? "category-title" : "category-title"}
    >
      {category[`title_${language}`] || category.title}
    </h2>
  );
};

export default RepeatedCategoryTitle;
