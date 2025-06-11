
import { classicLayout } from './classicLayout';
import { allergensLayout } from './allergensLayout';
import { modernLayout } from './modernLayout';
import { classicSchema1 } from './schemas/classicSchema1';

export const layoutTemplates = {
  classic: classicLayout,
  allergens: allergensLayout,
  modern: modernLayout,
  classicSchema1: classicSchema1
};

export { classicLayout, allergensLayout, modernLayout, classicSchema1 };
