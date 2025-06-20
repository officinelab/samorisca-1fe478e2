
import React from 'react';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import CategoryRenderer from '../../CategoryRenderer';
import ProductRenderer from '../../ProductRenderer';

interface CategorySection {
  category: Category;
  notes: CategoryNote[];
  products: Product[];
  isRepeatedTitle: boolean;
}

interface PageContentSectionProps {
  categories: CategorySection[];
  layout: PrintLayout;
}

const PageContentSection: React.FC<PageContentSectionProps> = ({
  categories,
  layout
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      {categories.map((categorySection, categoryIndex) => (
        <div key={`${categorySection.category.id}-${categoryIndex}`}>
          {/* Category title and notes */}
          <CategoryRenderer
            category={categorySection.category}
            notes={categorySection.notes}
            layout={layout}
            isRepeatedTitle={categorySection.isRepeatedTitle}
          />
          
          {/* Products for this category */}
          <div className="space-y-1">
            {categorySection.products.map((product, productIndex) => (
              <ProductRenderer
                key={product.id}
                product={product}
                layout={layout}
                isLast={productIndex === categorySection.products.length - 1}
              />
            ))}
          </div>

          {/* Spacing between categories */}
          {categoryIndex < categories.length - 1 && (
            <div style={{ height: `${layout.spacing.betweenCategories}mm` }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default PageContentSection;
