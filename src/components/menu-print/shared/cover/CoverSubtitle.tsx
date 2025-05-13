
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

export interface CoverSubtitleProps {
  customLayout?: PrintLayout | null;
  children?: React.ReactNode;
}

const CoverSubtitle: React.FC<CoverSubtitleProps> = ({ 
  customLayout, 
  children = "I nostri piatti" 
}) => {
  // Check if the subtitle is visible - default to true if not defined
  const isSubtitleVisible = customLayout?.cover?.subtitle?.visible !== false;

  if (!isSubtitleVisible) {
    return null;
  }

  // Get subtitle style from custom layout or use defaults
  const subtitleStyle = {
    fontFamily: customLayout?.cover?.subtitle?.fontFamily || 'inherit',
    fontSize: `${customLayout?.cover?.subtitle?.fontSize || 24}px`,
    color: customLayout?.cover?.subtitle?.fontColor || '#666666',
    fontWeight: (customLayout?.cover?.subtitle?.fontStyle === 'bold') ? 'bold' : 'normal',
    fontStyle: (customLayout?.cover?.subtitle?.fontStyle === 'italic') ? 'italic' : 'normal',
    textAlign: (customLayout?.cover?.subtitle?.alignment || 'center') as 'center' | 'left' | 'right',
    margin: `${customLayout?.cover?.subtitle?.margin?.top || 0}px ${customLayout?.cover?.subtitle?.margin?.right || 0}px ${customLayout?.cover?.subtitle?.margin?.bottom || 0}px ${customLayout?.cover?.subtitle?.margin?.left || 0}px`,
  } as React.CSSProperties;

  return (
    <p style={subtitleStyle}>
      {children}
    </p>
  );
};

export default CoverSubtitle;
