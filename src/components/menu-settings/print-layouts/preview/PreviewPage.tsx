import React from "react";
import { PrintLayout } from "@/types/printLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPageMargins } from "./ElementStyles";
import PreviewProduct from "./PreviewProduct";
import { getSampleData } from "./SampleData";

interface PreviewPageProps {
  layout: PrintLayout;
  pageIndex: number;
  pageTitle: string;
  subtitle?: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ 
  layout, 
  pageIndex, 
  pageTitle,
  subtitle
}) => {
  const { sampleCategories, sampleProducts } = getSampleData();
  
  return (
    <div className="border rounded-md p-4 bg-white mb-4">
      <div className="mb-2 text-sm text-muted-foreground">
        {pageTitle}
        {layout.page.useDistinctMarginsForPages && 
          <span className="font-medium ml-2">
            {pageIndex % 2 === 0 ? '- Margini Dispari' : '- Margini Pari'}
          </span>
        }
        {subtitle && <span className="ml-2">- {subtitle}</span>}
      </div>
      <ScrollArea className="h-[300px]">
        <div className="menu-preview" style={getPageMargins(layout, pageIndex)}>
          {sampleCategories.map((category) => (
            <div 
              key={`${pageIndex}-${category.id}`} 
              style={{ 
                marginBottom: `${layout.spacing.betweenCategories}mm`
              }}
            >
              <h2 style={{
                fontFamily: layout.elements.category.fontFamily,
                fontSize: `${layout.elements.category.fontSize}pt`,
                color: layout.elements.category.fontColor,
                fontWeight: layout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal',
                fontStyle: layout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal',
                textAlign: layout.elements.category.alignment,
                marginTop: `${layout.elements.category.margin.top}mm`,
                marginRight: `${layout.elements.category.margin.right}mm`,
                marginBottom: `${layout.spacing.categoryTitleBottomMargin}mm`,
                marginLeft: `${layout.elements.category.margin.left}mm`,
              }}>
                {category.title}
              </h2>
              
              {sampleProducts[category.id].slice(pageIndex % 2, pageIndex % 2 + 1).map((product) => (
                <PreviewProduct
                  key={`${pageIndex}-${product.id}`}
                  product={product}
                  layout={layout}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PreviewPage;
