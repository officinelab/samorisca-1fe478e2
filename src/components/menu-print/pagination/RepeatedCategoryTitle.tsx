
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
  const categoryStyle: React.CSSProperties = customLayout 
    ? getElementStyle(customLayout.elements.category, {
        marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      })
    : {
        fontSize: '18pt',
        fontWeight: 'bold',
        marginBottom: '5mm',
        textTransform: 'uppercase' as const,
        borderBottom: '1px solid #000',
        paddingBottom: '2mm'
      };

  return (
    <h2 style={categoryStyle} className="category-title">
      {category[`title_${language}`] || category.title}
      {isRepeated && <span style={{ fontSize: '0.8em', fontStyle: 'italic' }}> (continua)</span>}
    </h2>
  );
};

export default RepeatedCategoryTitle;
