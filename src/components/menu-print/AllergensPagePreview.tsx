
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import AllergensPageLayout from './allergens/AllergensPageLayout';

interface AllergensPagePreviewProps {
  layout: PrintLayout;
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  showMargins: boolean;
  pageNumber: number;
  isFirstPage?: boolean;
  showTitleAndDescription?: boolean;
}

const AllergensPagePreview: React.FC<AllergensPagePreviewProps> = (props) => {
  return <AllergensPageLayout {...props} />;
};

export default AllergensPagePreview;
