
import { useState, useEffect, useRef } from 'react';
import { Product, Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';

interface MeasurementData {
  categoryTitles: Map<string, number>;
  categoryNotes: Map<string, number>;
  products: Map<string, number>;
  serviceLineHeight: number;
}

export const usePreRenderMeasurement = (
  categories: Category[],
  productsByCategory: Record<string, Product[]>,
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  layout: PrintLayout | null
) => {
  const [measurements, setMeasurements] = useState<MeasurementData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layout || categories.length === 0) return;

    const calculateMeasurements = async () => {
      setIsCalculating(true);
      
      // Create hidden container for measurements
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '180mm'; // A4 width minus margins
      container.style.visibility = 'hidden';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);

      const categoryTitles = new Map<string, number>();
      const categoryNotesMap = new Map<string, number>();
      const products = new Map<string, number>();

      try {
        // Measure category titles
        for (const category of categories) {
          const titleElement = document.createElement('div');
          titleElement.textContent = category.title;
          titleElement.style.fontSize = `${layout.elements.category.fontSize}pt`;
          titleElement.style.fontFamily = layout.elements.category.fontFamily;
          titleElement.style.fontWeight = layout.elements.category.fontStyle === 'bold' ? 'bold' : 'normal';
          titleElement.style.fontStyle = layout.elements.category.fontStyle === 'italic' ? 'italic' : 'normal';
          titleElement.style.textTransform = 'uppercase';
          titleElement.style.marginTop = `${layout.elements.category.margin.top}mm`;
          titleElement.style.marginBottom = `${layout.spacing.categoryTitleBottomMargin}mm`;
          titleElement.style.width = '100%';
          titleElement.style.wordWrap = 'break-word';

          container.appendChild(titleElement);
          await new Promise(resolve => setTimeout(resolve, 0)); // Allow DOM update
          const rect = titleElement.getBoundingClientRect();
          categoryTitles.set(category.id, rect.height * 0.2646); // Convert px to mm
          container.removeChild(titleElement);
        }

        // Measure category notes
        for (const note of categoryNotes) {
          const noteContainer = document.createElement('div');
          noteContainer.style.display = 'flex';
          noteContainer.style.alignItems = 'flex-start';
          noteContainer.style.gap = '2px';
          noteContainer.style.marginBottom = '4mm';

          // Note icon (if exists)
          if (note.icon_url) {
            const iconElement = document.createElement('img');
            iconElement.src = note.icon_url;
            iconElement.style.width = `${layout.categoryNotes.icon.iconSize}px`;
            iconElement.style.height = `${layout.categoryNotes.icon.iconSize}px`;
            iconElement.style.flexShrink = '0';
            noteContainer.appendChild(iconElement);
          }

          const textContainer = document.createElement('div');
          textContainer.style.flex = '1';

          // Note title
          if (layout.categoryNotes.title.visible) {
            const titleElement = document.createElement('div');
            titleElement.textContent = note.title;
            titleElement.style.fontSize = `${layout.categoryNotes.title.fontSize}pt`;
            titleElement.style.fontFamily = layout.categoryNotes.title.fontFamily;
            titleElement.style.fontWeight = layout.categoryNotes.title.fontStyle === 'bold' ? 'bold' : 'normal';
            titleElement.style.fontStyle = layout.categoryNotes.title.fontStyle === 'italic' ? 'italic' : 'normal';
            titleElement.style.marginTop = `${layout.categoryNotes.title.margin.top}mm`;
            titleElement.style.marginBottom = `${layout.categoryNotes.title.margin.bottom}mm`;
            textContainer.appendChild(titleElement);
          }

          // Note text
          if (layout.categoryNotes.text.visible) {
            const textElement = document.createElement('div');
            textElement.textContent = note.text;
            textElement.style.fontSize = `${layout.categoryNotes.text.fontSize}pt`;
            textElement.style.fontFamily = layout.categoryNotes.text.fontFamily;
            textElement.style.fontWeight = layout.categoryNotes.text.fontStyle === 'bold' ? 'bold' : 'normal';
            textElement.style.fontStyle = layout.categoryNotes.text.fontStyle === 'italic' ? 'italic' : 'normal';
            textElement.style.marginTop = `${layout.categoryNotes.text.margin.top}mm`;
            textElement.style.marginBottom = `${layout.categoryNotes.text.margin.bottom}mm`;
            textContainer.appendChild(textElement);
          }

          noteContainer.appendChild(textContainer);
          container.appendChild(noteContainer);
          await new Promise(resolve => setTimeout(resolve, 0));
          const rect = noteContainer.getBoundingClientRect();
          categoryNotesMap.set(note.id, rect.height * 0.2646); // Convert px to mm
          container.removeChild(noteContainer);
        }

        // Measure products
        for (const categoryProducts of Object.values(productsByCategory)) {
          for (const product of categoryProducts) {
            const productContainer = document.createElement('div');
            productContainer.style.display = 'flex';
            productContainer.style.alignItems = 'flex-start';
            productContainer.style.gap = '8px';
            productContainer.style.width = '100%';

            // Left column (90%)
            const leftColumn = document.createElement('div');
            leftColumn.style.width = '90%';
            leftColumn.style.flex = '1';

            // Product title
            const titleElement = document.createElement('div');
            titleElement.textContent = product.title;
            titleElement.style.fontSize = `${layout.elements.title.fontSize}pt`;
            titleElement.style.fontFamily = layout.elements.title.fontFamily;
            titleElement.style.fontWeight = layout.elements.title.fontStyle === 'bold' ? 'bold' : 'normal';
            titleElement.style.fontStyle = layout.elements.title.fontStyle === 'italic' ? 'italic' : 'normal';
            titleElement.style.marginTop = `${layout.elements.title.margin.top}mm`;
            titleElement.style.marginBottom = `${layout.elements.title.margin.bottom}mm`;
            titleElement.style.wordWrap = 'break-word';
            leftColumn.appendChild(titleElement);

            // Product description
            if (product.description) {
              const descElement = document.createElement('div');
              descElement.textContent = product.description;
              descElement.style.fontSize = `${layout.elements.description.fontSize}pt`;
              descElement.style.fontFamily = layout.elements.description.fontFamily;
              descElement.style.fontWeight = layout.elements.description.fontStyle === 'bold' ? 'bold' : 'normal';
              descElement.style.fontStyle = layout.elements.description.fontStyle === 'italic' ? 'italic' : 'normal';
              descElement.style.marginTop = `${layout.elements.description.margin.top}mm`;
              descElement.style.marginBottom = `${layout.elements.description.margin.bottom}mm`;
              descElement.style.wordWrap = 'break-word';
              leftColumn.appendChild(descElement);
            }

            // English description
            if (product.description_en && 
                product.description_en !== product.description && 
                layout.elements.descriptionEng?.visible !== false) {
              const descEngElement = document.createElement('div');
              descEngElement.textContent = product.description_en;
              descEngElement.style.fontSize = `${layout.elements.descriptionEng.fontSize}pt`;
              descEngElement.style.fontFamily = layout.elements.descriptionEng.fontFamily;
              descEngElement.style.fontWeight = layout.elements.descriptionEng.fontStyle === 'bold' ? 'bold' : 'normal';
              descEngElement.style.fontStyle = layout.elements.descriptionEng.fontStyle === 'italic' ? 'italic' : 'normal';
              descEngElement.style.marginTop = `${layout.elements.descriptionEng.margin.top}mm`;
              descEngElement.style.marginBottom = `${layout.elements.descriptionEng.margin.bottom}mm`;
              descEngElement.style.wordWrap = 'break-word';
              leftColumn.appendChild(descEngElement);
            }

            // Allergens
            if (product.allergens && product.allergens.length > 0) {
              const allergensElement = document.createElement('div');
              allergensElement.textContent = `Allergeni: ${product.allergens.map(allergen => allergen.number).join(', ')}`;
              allergensElement.style.fontSize = `${layout.elements.allergensList.fontSize}pt`;
              allergensElement.style.fontFamily = layout.elements.allergensList.fontFamily;
              allergensElement.style.fontWeight = layout.elements.allergensList.fontStyle === 'bold' ? 'bold' : 'normal';
              allergensElement.style.fontStyle = layout.elements.allergensList.fontStyle === 'italic' ? 'italic' : 'normal';
              allergensElement.style.marginTop = `${layout.elements.allergensList.margin.top}mm`;
              allergensElement.style.marginBottom = `${layout.elements.allergensList.margin.bottom}mm`;
              leftColumn.appendChild(allergensElement);
            }

            // Product features
            if (product.features && product.features.length > 0) {
              const featuresElement = document.createElement('div');
              featuresElement.style.display = 'flex';
              featuresElement.style.alignItems = 'center';
              featuresElement.style.gap = `${layout.elements.productFeatures.iconSpacing}px`;
              featuresElement.style.marginTop = `${layout.elements.productFeatures.marginTop}mm`;
              featuresElement.style.marginBottom = `${layout.elements.productFeatures.marginBottom}mm`;

              product.features.forEach(feature => {
                if (feature.icon_url) {
                  const iconElement = document.createElement('img');
                  iconElement.src = feature.icon_url;
                  iconElement.style.width = `${layout.elements.productFeatures.iconSize}px`;
                  iconElement.style.height = `${layout.elements.productFeatures.iconSize}px`;
                  featuresElement.appendChild(iconElement);
                }
              });

              leftColumn.appendChild(featuresElement);
            }

            // Price variants
            if (product.has_multiple_prices && (product.price_variant_1_name || product.price_variant_2_name)) {
              const variantsElement = document.createElement('div');
              const variantsText = [
                product.price_variant_1_name ? `${product.price_variant_1_name}: €${product.price_variant_1_value?.toFixed(2)}` : '',
                product.price_variant_2_name ? `${product.price_variant_2_name}: €${product.price_variant_2_value?.toFixed(2)}` : ''
              ].filter(Boolean).join(' • ');
              variantsElement.textContent = variantsText;
              variantsElement.style.fontSize = `${layout.elements.priceVariants.fontSize}pt`;
              variantsElement.style.fontFamily = layout.elements.priceVariants.fontFamily;
              variantsElement.style.fontWeight = layout.elements.priceVariants.fontStyle === 'bold' ? 'bold' : 'normal';
              variantsElement.style.fontStyle = layout.elements.priceVariants.fontStyle === 'italic' ? 'italic' : 'normal';
              variantsElement.style.marginTop = `${layout.elements.priceVariants.margin.top}mm`;
              variantsElement.style.marginBottom = `${layout.elements.priceVariants.margin.bottom}mm`;
              leftColumn.appendChild(variantsElement);
            }

            // Right column (10%)
            const rightColumn = document.createElement('div');
            rightColumn.style.width = '10%';
            rightColumn.style.flexShrink = '0';
            rightColumn.style.textAlign = 'right';

            if (product.price_standard) {
              const priceElement = document.createElement('div');
              let priceText = `€${product.price_standard.toFixed(2)}`;
              if (product.has_price_suffix && product.price_suffix) {
                priceText += ` ${product.price_suffix}`;
              }
              priceElement.textContent = priceText;
              priceElement.style.fontSize = `${layout.elements.price.fontSize}pt`;
              priceElement.style.fontFamily = layout.elements.price.fontFamily;
              priceElement.style.fontWeight = layout.elements.price.fontStyle === 'bold' ? 'bold' : 'normal';
              priceElement.style.fontStyle = layout.elements.price.fontStyle === 'italic' ? 'italic' : 'normal';
              priceElement.style.marginTop = `${layout.elements.price.margin.top}mm`;
              priceElement.style.marginBottom = `${layout.elements.price.margin.bottom}mm`;
              rightColumn.appendChild(priceElement);
            }

            productContainer.appendChild(leftColumn);
            productContainer.appendChild(rightColumn);
            container.appendChild(productContainer);
            await new Promise(resolve => setTimeout(resolve, 0));
            const rect = productContainer.getBoundingClientRect();
            products.set(product.id, rect.height * 0.2646 + 2); // Convert px to mm + spacing
            container.removeChild(productContainer);
          }
        }

        // Measure service line
        const serviceElement = document.createElement('div');
        serviceElement.textContent = `Servizio e Coperto = €0.00`;
        serviceElement.style.fontSize = `${layout.servicePrice.fontSize}pt`;
        serviceElement.style.fontFamily = layout.servicePrice.fontFamily;
        serviceElement.style.fontWeight = layout.servicePrice.fontStyle === 'bold' ? 'bold' : 'normal';
        serviceElement.style.fontStyle = layout.servicePrice.fontStyle === 'italic' ? 'italic' : 'normal';
        serviceElement.style.marginTop = `${layout.servicePrice.margin.top}mm`;
        serviceElement.style.marginBottom = `${layout.servicePrice.margin.bottom}mm`;
        serviceElement.style.borderTop = '1px solid black';
        serviceElement.style.paddingTop = '2mm';

        container.appendChild(serviceElement);
        await new Promise(resolve => setTimeout(resolve, 0));
        const serviceRect = serviceElement.getBoundingClientRect();
        const serviceLineHeight = serviceRect.height * 0.2646 + 5; // Convert px to mm + padding

        setMeasurements({
          categoryTitles,
          categoryNotes: categoryNotesMap,
          products,
          serviceLineHeight
        });

      } finally {
        document.body.removeChild(container);
        setIsCalculating(false);
      }
    };

    calculateMeasurements();
  }, [categories, productsByCategory, categoryNotes, categoryNotesRelations, layout]);

  return { measurements, isCalculating };
};
