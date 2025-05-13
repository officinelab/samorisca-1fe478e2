
import React from 'react';
import { Category } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

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
  // Utilizza lo stile del layout personalizzato se disponibile
  const getCategoryStyle = () => {
    if (!customLayout || !customLayout.elements.category) {
      return {
        fontFamily: 'Arial',
        fontSize: '18pt',
        color: '#000',
        fontWeight: 'bold' as const,
        fontStyle: 'normal' as const,
        textAlign: 'left' as React.CSSProperties['textAlign'],
        marginBottom: '10px',
        breakInside: 'avoid' as const,
        pageBreakInside: 'avoid' as const,
      };
    }
    
    const element = customLayout.elements.category;
    return {
      fontFamily: element.fontFamily || 'Arial',
      fontSize: `${element.fontSize}pt`,
      color: element.fontColor,
      fontWeight: element.fontStyle === 'bold' ? 'bold' as const : 'normal' as const,
      fontStyle: element.fontStyle === 'italic' ? 'italic' as const : 'normal' as const,
      textAlign: element.alignment as React.CSSProperties['textAlign'],
      marginTop: `${element.margin.top}mm`,
      marginRight: `${element.margin.right}mm`,
      marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
      marginLeft: `${element.margin.left}mm`,
      breakInside: 'avoid' as const,
      pageBreakInside: 'avoid' as const,
    };
  };
  
  return (
    <div className="category">
      <h2 
        className="category-title" 
        style={getCategoryStyle()}
      >
        {category[`title_${language}`] || category.title}
      </h2>
    </div>
  );
};

export default RepeatedCategoryTitle;
