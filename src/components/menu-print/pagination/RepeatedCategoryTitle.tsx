
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
  // Funzione per ottenere gli stili del titolo
  const getTitleStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: 'Arial',
      fontSize: '16pt',
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: '10px',
      paddingBottom: '5px',
      borderBottom: '1px solid #000',
      textAlign: 'left',
    };
    
    // Se non c'è un layout personalizzato, usa lo stile base
    if (!customLayout) {
      return baseStyle;
    }
    
    // Usa le configurazioni dal layout personalizzato
    const categoryStyle = customLayout.elements.category;
    
    return {
      fontFamily: categoryStyle.fontFamily,
      fontSize: `${categoryStyle.fontSize}pt`,
      fontWeight: categoryStyle.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: categoryStyle.fontStyle === 'italic' ? 'italic' : 'normal',
      color: categoryStyle.fontColor,
      textAlign: categoryStyle.alignment as "left" | "center" | "right" | "justify",
      marginTop: `${categoryStyle.margin.top}mm`,
      marginRight: `${categoryStyle.margin.right}mm`,
      marginBottom: `${customLayout.spacing.categoryTitleBottomMargin}mm`,
      marginLeft: `${categoryStyle.margin.left}mm`,
      paddingBottom: '5px',
      borderBottom: '1px solid #000',
      // Se è un titolo ripetuto, aggiungi un'indicazione visiva
      ...(isRepeated && {
        fontSize: `${Math.max(categoryStyle.fontSize - 2, 12)}pt`, // Leggermente più piccolo
        opacity: 0.9,
        fontStyle: 'italic'
      })
    };
  };
  
  // Non renderizzare se il titolo non deve essere visibile
  if (customLayout && customLayout.elements.category.visible === false) {
    return null;
  }
  
  return (
    <div className="category-title">
      <h2 
        style={getTitleStyle()}
        className={`category-heading ${isRepeated ? 'repeated-title' : ''}`}
      >
        {category[`title_${language}`] || category.title}
        {isRepeated && (
          <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '8px' }}>
            (continua)
          </span>
        )}
      </h2>
    </div>
  );
};

export default RepeatedCategoryTitle;
