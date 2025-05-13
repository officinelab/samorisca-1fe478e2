
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { getSubtitleStyle } from './coverStyleUtils';

interface CoverSubtitleProps {
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  customLayout?: PrintLayout | null;
  children?: React.ReactNode;
}

const CoverSubtitle: React.FC<CoverSubtitleProps> = ({ 
  layoutType, 
  customLayout, 
  children = "I nostri piatti" 
}) => {
  // Check if the subtitle is visible - default to true if not defined
  const isSubtitleVisible = customLayout?.cover?.subtitle?.visible !== false;

  if (!isSubtitleVisible) {
    return null;
  }

  return (
    <p style={getSubtitleStyle(layoutType, customLayout)}>
      {children}
    </p>
  );
};

export default CoverSubtitle;
