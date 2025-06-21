
import { getClassicLayout } from './classicLayout';
import { getAllergensLayout } from './allergensLayout';
import { getModernLayout } from './modernLayout';
import { getClassicSchema1Layout } from './schemas/classicSchema1';

export const layoutTemplates = {
  classic: getClassicLayout,
  allergens: getAllergensLayout,
  modern: getModernLayout,
  classicSchema1: getClassicSchema1Layout
};

export { getClassicLayout as classicLayout, getAllergensLayout as allergensLayout, getModernLayout as modernLayout, getClassicSchema1Layout as classicSchema1 };
