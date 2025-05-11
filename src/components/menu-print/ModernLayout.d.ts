
import React from 'react';
import { Category, Product, Allergen } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';

export interface ModernLayoutProps {
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

declare const ModernLayout: React.FC<ModernLayoutProps>;
export default ModernLayout;
