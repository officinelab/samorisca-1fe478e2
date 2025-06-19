// hooks/print/usePreRenderMeasurement.tsx
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import CategoryRenderer from '@/components/menu-print/CategoryRenderer';
import ProductRenderer from '@/components/menu-print/ProductRenderer';

// Costante di conversione mm to px
export const MM_TO_PX = 3.7795275591; // 96 DPI

interface MeasurementResult {
  categoryHeights: Map<string, number>;
  productHeights: Map<string, number>;
  categoryNoteHeights: Map<string, number>;
  serviceLineHeight: number;
}

export const usePreRenderMeasurement = (
  layout: PrintLayout | null,
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  serviceCoverCharge: number
) => {
  const [measurements, setMeasurements] = useState<MeasurementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const measurementContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!layout || categories.length === 0) return;

    const measureElements = async () => {
      setIsLoading(true);

      // Crea container di misurazione se non esiste
      if (!measurementContainerRef.current) {
        measurementContainerRef.current = document.createElement('div');
        measurementContainerRef.current.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: ${210}mm;
          visibility: hidden;
          pointer-events: none;
          z-index: -1;
        `;
        document.body.appendChild(measurementContainerRef.current);
      }

      const container = measurementContainerRef.current;
      const results: MeasurementResult = {
        categoryHeights: new Map(),
        productHeights: new Map(),
        categoryNoteHeights: new Map(),
        serviceLineHeight: 0
      };

      // Calcola larghezza disponibile considerando i margini
      const pageMargins = layout.page;
      const contentWidth = 210 - pageMargins.marginLeft - pageMargins.marginRight;
      
      // Imposta la larghezza del container
      container.style.width = `${contentWidth}mm`;
      container.style.padding = `0`;
      container.style.boxSizing = 'border-box';

      // Misura ogni categoria
      for (const category of categories) {
        // Renderizza e misura il titolo categoria
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
          <div class="category-title" style="
            font-size: ${layout.elements.category.fontSize}pt;
            font-family: ${layout.elements.category.fontFamily};
            color: ${layout.elements.category.fontColor};
            font-weight: ${layout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal'};
            font-style: ${layout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal'};
            text-align: ${layout.elements.category.alignment};
            text-transform: uppercase;
            margin-top: ${layout.elements.category.margin.top}mm;
            margin-right: ${layout.elements.category.margin.right}mm;
            margin-bottom: ${layout.spacing.categoryTitleBottomMargin}mm;
            margin-left: ${layout.elements.category.margin.left}mm;
            line-height: 1.2;
          ">
            ${category.title}
          </div>
        `;
        
        container.innerHTML = '';
        container.appendChild(categoryDiv);
        
        // Forza il browser a calcolare il layout
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const categoryHeight = categoryDiv.getBoundingClientRect().height / MM_TO_PX;
        results.categoryHeights.set(category.id, categoryHeight);

        // Misura le note categoria
        const relatedNoteIds = categoryNotesRelations[category.id] || [];
        const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
        
        for (const note of relatedNotes) {
          const noteDiv = document.createElement('div');
          noteDiv.innerHTML = `
            <div class="category-note" style="display: flex; align-items: start; gap: 8px;">
              ${note.icon_url ? `<img src="${note.icon_url}" style="width: ${layout.categoryNotes.icon.iconSize}px; height: ${layout.categoryNotes.icon.iconSize}px; flex-shrink: 0;">` : ''}
              <div style="flex: 1;">
                <div style="
                  font-size: ${layout.categoryNotes.title.fontSize}pt;
                  font-family: ${layout.categoryNotes.title.fontFamily};
                  color: ${layout.categoryNotes.title.fontColor};
                  font-weight: ${layout.categoryNotes.title.fontStyle === 'bold' ? 'bold' : 'normal'};
                  font-style: ${layout.categoryNotes.title.fontStyle === 'italic' ? 'italic' : 'normal'};
                  text-align: ${layout.categoryNotes.title.alignment};
                  margin-top: ${layout.categoryNotes.title.margin.top}mm;
                  margin-right: ${layout.categoryNotes.title.margin.right}mm;
                  margin-bottom: ${layout.categoryNotes.title.margin.bottom}mm;
                  margin-left: ${layout.categoryNotes.title.margin.left}mm;
                ">
                  ${note.title}
                </div>
                <div style="
                  font-size: ${layout.categoryNotes.text.fontSize}pt;
                  font-family: ${layout.categoryNotes.text.fontFamily};
                  color: ${layout.categoryNotes.text.fontColor};
                  font-weight: ${layout.categoryNotes.text.fontStyle === 'bold' ? 'bold' : 'normal'};
                  font-style: ${layout.categoryNotes.text.fontStyle === 'italic' ? 'italic' : 'normal'};
                  text-align: ${layout.categoryNotes.text.alignment};
                  margin-top: ${layout.categoryNotes.text.margin.top}mm;
                  margin-right: ${layout.categoryNotes.text.margin.right}mm;
                  margin-bottom: ${layout.categoryNotes.text.margin.bottom}mm;
                  margin-left: ${layout.categoryNotes.text.margin.left}mm;
                ">
                  ${note.text}
                </div>
              </div>
            </div>
          `;
          
          container.innerHTML = '';
          container.appendChild(noteDiv);
          await new Promise(resolve => setTimeout(resolve, 0));
          
          const noteHeight = noteDiv.getBoundingClientRect().height / MM_TO_PX;
          results.categoryNoteHeights.set(note.id, noteHeight);
        }

        // Misura ogni prodotto
        const products = productsByCategory[category.id] || [];
        for (const product of products) {
          const productDiv = document.createElement('div');
          
          // Costruisci HTML del prodotto seguendo lo schema 1 (90% + 10%)
          const allergenNumbers = product.allergens && product.allergens.length > 0 
            ? product.allergens.map(allergen => allergen.number).join(', ') 
            : '';
          
          const hasEnglishDesc = product.description_en && 
                                product.description_en !== product.description && 
                                layout.elements.descriptionEng?.visible !== false;

          productDiv.innerHTML = `
            <div class="product-item" style="display: flex; gap: 8px;">
              <div style="flex: 1; width: 90%;">
                <div style="
                  font-size: ${layout.elements.title.fontSize}pt;
                  font-family: ${layout.elements.title.fontFamily};
                  color: ${layout.elements.title.fontColor};
                  font-weight: ${layout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal'};
                  font-style: ${layout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal'};
                  text-align: ${layout.elements.title.alignment};
                  margin-top: ${layout.elements.title.margin.top}mm;
                  margin-right: ${layout.elements.title.margin.right}mm;
                  margin-bottom: ${layout.elements.title.margin.bottom}mm;
                  margin-left: ${layout.elements.title.margin.left}mm;
                  line-height: 1.3;
                ">
                  ${product.title}
                </div>
                
                ${product.description ? `
                  <div style="
                    font-size: ${layout.elements.description.fontSize}pt;
                    font-family: ${layout.elements.description.fontFamily};
                    color: ${layout.elements.description.fontColor};
                    font-weight: ${layout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal'};
                    font-style: ${layout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal'};
                    text-align: ${layout.elements.description.alignment};
                    margin-top: ${layout.elements.description.margin.top}mm;
                    margin-right: ${layout.elements.description.margin.right}mm;
                    margin-bottom: ${layout.elements.description.margin.bottom}mm;
                    margin-left: ${layout.elements.description.margin.left}mm;
                    line-height: 1.4;
                  ">
                    ${product.description}
                  </div>
                ` : ''}
                
                ${hasEnglishDesc ? `
                  <div style="
                    font-size: ${layout.elements.descriptionEng.fontSize}pt;
                    font-family: ${layout.elements.descriptionEng.fontFamily};
                    color: ${layout.elements.descriptionEng.fontColor};
                    font-weight: ${layout.elements.descriptionEng.fontStyle === 'bold' ? 'bold' : 'normal'};
                    font-style: ${layout.elements.descriptionEng.fontStyle === 'italic' ? 'italic' : 'normal'};
                    text-align: ${layout.elements.descriptionEng.alignment};
                    margin-top: ${layout.elements.descriptionEng.margin.top}mm;
                    margin-right: ${layout.elements.descriptionEng.margin.right}mm;
                    margin-bottom: ${layout.elements.descriptionEng.margin.bottom}mm;
                    margin-left: ${layout.elements.descriptionEng.margin.left}mm;
                    line-height: 1.4;
                  ">
                    ${product.description_en}
                  </div>
                ` : ''}
                
                ${allergenNumbers ? `
                  <div style="
                    font-size: ${layout.elements.allergensList.fontSize}pt;
                    font-family: ${layout.elements.allergensList.fontFamily};
                    color: ${layout.elements.allergensList.fontColor};
                    font-weight: ${layout.elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal'};
                    font-style: ${layout.elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal'};
                    text-align: ${layout.elements.allergensList.alignment};
                    margin-top: ${layout.elements.allergensList.margin.top}mm;
                    margin-right: ${layout.elements.allergensList.margin.right}mm;
                    margin-bottom: ${layout.elements.allergensList.margin.bottom}mm;
                    margin-left: ${layout.elements.allergensList.margin.left}mm;
                    line-height: 1.5;
                  ">
                    Allergeni: ${allergenNumbers}
                  </div>
                ` : ''}
                
                ${product.features && product.features.length > 0 ? `
                  <div style="
                    display: flex;
                    align-items: center;
                    gap: ${layout.elements.productFeatures.iconSpacing}px;
                    margin-top: ${layout.elements.productFeatures.marginTop}mm;
                    margin-bottom: ${layout.elements.productFeatures.marginBottom}mm;
                  ">
                    ${product.features.map(feature => 
                      feature.icon_url ? `<img src="${feature.icon_url}" style="width: ${layout.elements.productFeatures.iconSize}px; height: ${layout.elements.productFeatures.iconSize}px;">` : ''
                    ).join('')}
                  </div>
                ` : ''}
                
                ${product.has_multiple_prices && (product.price_variant_1_name || product.price_variant_2_name) ? `
                  <div style="
                    font-size: ${layout.elements.priceVariants.fontSize}pt;
                    font-family: ${layout.elements.priceVariants.fontFamily};
                    color: ${layout.elements.priceVariants.fontColor};
                    font-weight: ${layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal'};
                    font-style: ${layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal'};
                    text-align: ${layout.elements.priceVariants.alignment};
                    margin-top: ${layout.elements.priceVariants.margin.top}mm;
                    margin-right: ${layout.elements.priceVariants.margin.right}mm;
                    margin-bottom: ${layout.elements.priceVariants.margin.bottom}mm;
                    margin-left: ${layout.elements.priceVariants.margin.left}mm;
                    line-height: 1.5;
                  ">
                    ${[
                      product.price_variant_1_name ? `${product.price_variant_1_name}: €${product.price_variant_1_value?.toFixed(2)}` : '',
                      product.price_variant_2_name ? `${product.price_variant_2_name}: €${product.price_variant_2_value?.toFixed(2)}` : ''
                    ].filter(Boolean).join(' • ')}
                  </div>
                ` : ''}
              </div>
              
              <div style="flex-shrink: 0; width: 10%;">
                ${product.price_standard ? `
                  <div style="
                    font-size: ${layout.elements.price.fontSize}pt;
                    font-family: ${layout.elements.price.fontFamily};
                    color: ${layout.elements.price.fontColor};
                    font-weight: ${layout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal'};
                    font-style: ${layout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal'};
                    text-align: ${layout.elements.price.alignment};
                    margin-top: ${layout.elements.price.margin.top}mm;
                    margin-right: ${layout.elements.price.margin.right}mm;
                    margin-bottom: ${layout.elements.price.margin.bottom}mm;
                    margin-left: ${layout.elements.price.margin.left}mm;
                  ">
                    €${product.price_standard.toFixed(2)}${product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : ''}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
          
          container.innerHTML = '';
          container.appendChild(productDiv);
          await new Promise(resolve => setTimeout(resolve, 0));
          
          const productHeight = productDiv.getBoundingClientRect().height / MM_TO_PX;
          results.productHeights.set(product.id, productHeight);
        }
      }

      // Misura la linea del servizio
      const serviceDiv = document.createElement('div');
      serviceDiv.innerHTML = `
        <div style="
          font-size: ${layout.servicePrice.fontSize}pt;
          font-family: ${layout.servicePrice.fontFamily};
          color: ${layout.servicePrice.fontColor};
          font-weight: ${layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal'};
          font-style: ${layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal'};
          text-align: ${layout.servicePrice.alignment};
          margin-top: ${layout.servicePrice.margin.top}mm;
          margin-bottom: ${layout.servicePrice.margin.bottom}mm;
          border-top: 1px solid #ccc;
          padding-top: 8px;
        ">
          Servizio e Coperto = €${serviceCoverCharge.toFixed(2)}
        </div>
      `;
      
      container.innerHTML = '';
      container.appendChild(serviceDiv);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      results.serviceLineHeight = serviceDiv.getBoundingClientRect().height / MM_TO_PX;

      setMeasurements(results);
      setIsLoading(false);
    };

    measureElements();

    // Cleanup
    return () => {
      if (measurementContainerRef.current && measurementContainerRef.current.parentNode) {
        measurementContainerRef.current.parentNode.removeChild(measurementContainerRef.current);
        measurementContainerRef.current = null;
      }
    };
  }, [layout, categories, productsByCategory, categoryNotes, categoryNotesRelations, serviceCoverCharge]);

  return { measurements, isLoading };
};
