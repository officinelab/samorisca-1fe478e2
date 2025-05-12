
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getTitleStyle } from './coverStyleUtils';

interface CoverTitleProps {
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  customLayout?: PrintLayout | null;
  children?: React.ReactNode;
}

const CoverTitle: React.FC<CoverTitleProps> = ({ 
  layoutType, 
  customLayout, 
  children = "Menu" 
}) => {
  // Check if the title is visible - default to true if not defined
  const isTitleVisible = customLayout?.cover?.title?.visible !== false;

  if (!isTitleVisible) {
    return null;
  }

  return (
    <h1 style={getTitleStyle(layoutType, customLayout)}>
      {children}
    </h1>
  );
};

export default CoverTitle;
