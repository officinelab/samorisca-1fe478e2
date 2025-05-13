
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

export interface CoverTitleProps {
  customLayout?: PrintLayout | null;
  children?: React.ReactNode;
}

const CoverTitle: React.FC<CoverTitleProps> = ({ 
  customLayout, 
  children = "Menu" 
}) => {
  // Check if the title is visible - default to true if not defined
  const isTitleVisible = customLayout?.cover?.title?.visible !== false;

  if (!isTitleVisible) {
    return null;
  }

  // Get title style from custom layout or use defaults
  const titleStyle = {
    fontFamily: customLayout?.cover?.title?.fontFamily || 'inherit',
    fontSize: `${customLayout?.cover?.title?.fontSize || 36}px`,
    color: customLayout?.cover?.title?.fontColor || '#000000',
    fontWeight: (customLayout?.cover?.title?.fontStyle === 'bold') ? 'bold' : 'normal',
    fontStyle: (customLayout?.cover?.title?.fontStyle === 'italic') ? 'italic' : 'normal',
    textAlign: (customLayout?.cover?.title?.alignment || 'center') as 'center' | 'left' | 'right',
    margin: `${customLayout?.cover?.title?.margin?.top || 0}px ${customLayout?.cover?.title?.margin?.right || 0}px ${customLayout?.cover?.title?.margin?.bottom || 20}px ${customLayout?.cover?.title?.margin?.left || 0}px`,
  } as React.CSSProperties;

  return (
    <h1 style={titleStyle}>
      {children}
    </h1>
  );
};

export default CoverTitle;
