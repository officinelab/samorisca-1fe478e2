
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
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'left',
        marginBottom: '10px',
      };
    }
    
    const element = customLayout.elements.category;
    return {
      fontFamily: element.fontFamily || 'Arial',
      fontSize: `${element.fontSize}pt`,
      color: element.fontColor,
      fontWeight: element.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: element.fontStyle === 'italic' ? 'italic' : 'normal',
      textAlign: element.alignment as any, // casting necessario per TypeScript
      marginTop: `${element.margin.top}mm`,
      marginRight: `${element.margin.right}mm`,
      marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
      marginLeft: `${element.margin.left}mm`,
    };
  };
  
  return (
    <div className="category">
      <h2 
        className="category-title" 
        style={getCategoryStyle()}
      >
        {/* Se è un titolo ripetuto, aggiungi un indicatore visivo (cont.) */}
        {category[`title_${language}`] || category.title}
        {isRepeated && <span className="text-muted-foreground text-sm"> (cont.)</span>}
      </h2>
    </div>
  );
};

export default RepeatedCategoryTitle;
