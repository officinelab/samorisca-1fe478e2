import React, { useRef, useEffect } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log("[RepeatedCategoryTitle] boundingClientRect.height", ref.current.getBoundingClientRect().height);
    }
  }, []);

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
    };
  };
  
  return (
    <div className="category" ref={ref}>
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
