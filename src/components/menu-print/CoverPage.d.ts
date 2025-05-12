
import React from 'react';
import { PrintLayout } from '@/types/printLayout';

export interface CoverPageProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  layoutType: 'classic' | 'modern' | 'allergens' | 'custom';
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
  pageIndex?: number;
}

declare const CoverPage: React.FC<CoverPageProps>;
export default CoverPage;
