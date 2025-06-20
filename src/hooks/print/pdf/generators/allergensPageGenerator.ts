
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import { addStyledText } from '../components/textRenderer';
import { addSvgIconToPdf } from '../components/iconRenderer';

// Get page margins for allergens page
const getAllergensPageMargins = (layout: PrintLayout, pageNumber: number) => {
  if (layout.page.useDistinctMarginsForAllergensPages && pageNumber) {
    const isOddPage = pageNumber % 2 === 1;
    if (isOddPage && layout.page.allergensOddPages) {
      return layout.page.allergensOddPages;
    } else if (!isOddPage && layout.page.allergensEvenPages) {
      return layout.page.allergensEvenPages;
    }
  }
  return {
    marginTop: layout.page.allergensMarginTop,
    marginRight: layout.page.allergensMarginRight,
    marginBottom: layout.page.allergensMarginBottom,
    marginLeft: layout.page.allergensMarginLeft
  };
};

// Generate allergens and product features page
export const generateAllergensPage = async (
  pdf: jsPDF, 
  layout: PrintLayout,
  allergens: Allergen[],
  productFeatures: ProductFeature[]
) => {
  console.log('📄 Generating allergens and product features page...');
  
  pdf.addPage();
  
  const pageNumber = 1; // Allergens is typically a single page
  const margins = getAllergensPageMargins(layout, pageNumber);
  const pageWidth = 210; // A4 width in mm
  const contentWidth = pageWidth - margins.marginLeft - margins.marginRight;
  
  let currentY = margins.marginTop;
  
  console.log('📐 Allergens page margins:', margins);
  console.log('📐 Content width:', contentWidth, 'mm, starting Y:', currentY, 'mm');
  
  // Titolo Menu Allergeni
  if (layout.allergens?.title) {
    const titleHeight = addStyledText(
      pdf,
      layout.allergens.title.text || 'Allergeni e Intolleranze',
      margins.marginLeft,
      currentY,
      {
        fontSize: layout.allergens.title.fontSize || 18,
        fontFamily: layout.allergens.title.fontFamily || 'helvetica',
        fontStyle: layout.allergens.title.fontStyle || 'bold',
        fontColor: layout.allergens.title.fontColor || '#000000',
        alignment: layout.allergens.title.alignment || 'center',
        maxWidth: contentWidth
      }
    );
    
    currentY += titleHeight + (layout.allergens.title.margin?.bottom || 10);
  }
  
  // Descrizione Menu Allergeni
  if (layout.allergens?.description) {
    const descriptionHeight = addStyledText(
      pdf,
      layout.allergens.description.text || 'Lista completa degli allergeni presenti nei nostri prodotti',
      margins.marginLeft,
      currentY,
      {
        fontSize: layout.allergens.description.fontSize || 12,
        fontFamily: layout.allergens.description.fontFamily || 'helvetica',
        fontStyle: layout.allergens.description.fontStyle || 'normal',
        fontColor: layout.allergens.description.fontColor || '#333333',
        alignment: layout.allergens.description.alignment || 'left',
        maxWidth: contentWidth
      }
    );
    
    currentY += descriptionHeight + (layout.allergens.description.margin?.bottom || 10);
  }
  
  // Spazio prima degli allergeni
  currentY += 5;
  
  // Sezioni Allergeni
  for (const allergen of allergens) {
    console.log('🏷️ Adding allergen:', allergen.title);
    
    let itemY = currentY;
    let maxItemHeight = 0;
    
    // Calcola la posizione per l'icona, numero e titolo sulla prima riga
    let itemX = margins.marginLeft;
    
    // Icona allergene
    if (allergen.icon_url) {
      const iconSizeMm = (layout.allergens.item.iconSize || 16) / 3.78; // px to mm
      await addSvgIconToPdf(pdf, allergen.icon_url, itemX, itemY, iconSizeMm);
      itemX += iconSizeMm + 3; // 3mm gap
      maxItemHeight = Math.max(maxItemHeight, iconSizeMm);
    }
    
    // Numero allergene
    const numberWidth = 10; // mm
    const numberHeight = addStyledText(
      pdf,
      allergen.number.toString(),
      itemX,
      itemY,
      {
        fontSize: layout.allergens.item.number.fontSize || 12,
        fontFamily: layout.allergens.item.number.fontFamily || 'helvetica',
        fontStyle: layout.allergens.item.number.fontStyle || 'bold',
        fontColor: layout.allergens.item.number.fontColor || '#000000',
        alignment: layout.allergens.item.number.alignment || 'left'
      }
    );
    itemX += numberWidth;
    maxItemHeight = Math.max(maxItemHeight, numberHeight);
    
    // Titolo allergene
    const titleHeight = addStyledText(
      pdf,
      allergen.title,
      itemX,
      itemY,
      {
        fontSize: layout.allergens.item.title.fontSize || 12,
        fontFamily: layout.allergens.item.title.fontFamily || 'helvetica',
        fontStyle: layout.allergens.item.title.fontStyle || 'normal',
        fontColor: layout.allergens.item.title.fontColor || '#000000',
        alignment: layout.allergens.item.title.alignment || 'left',
        maxWidth: contentWidth - (itemX - margins.marginLeft)
      }
    );
    maxItemHeight = Math.max(maxItemHeight, titleHeight);
    
    currentY += maxItemHeight;
    
    // Descrizione allergene (se presente) sulla seconda riga
    if (allergen.description) {
      currentY += 2; // Piccolo spazio tra titolo e descrizione
      
      const descHeight = addStyledText(
        pdf,
        allergen.description,
        margins.marginLeft + (allergen.icon_url ? ((layout.allergens.item.iconSize || 16) / 3.78) + 3 : 0),
        currentY,
        {
          fontSize: layout.allergens.item.description.fontSize || 10,
          fontFamily: layout.allergens.item.description.fontFamily || 'helvetica',
          fontStyle: layout.allergens.item.description.fontStyle || 'normal',
          fontColor: layout.allergens.item.description.fontColor || '#666666',
          alignment: layout.allergens.item.description.alignment || 'left',
          maxWidth: contentWidth - (allergen.icon_url ? ((layout.allergens.item.iconSize || 16) / 3.78) + 3 : 0)
        }
      );
      
      currentY += descHeight;
    }
    
    // Spazio tra allergeni
    currentY += layout.allergens.item.spacing || 5;
  }
  
  // Spazio di 3cm prima delle caratteristiche prodotto
  currentY += 30; // 30mm = 3cm
  
  // Sezione Caratteristiche Prodotto
  if (productFeatures.length > 0) {
    console.log('🏷️ Adding product features section...');
    
    for (let i = 0; i < productFeatures.length; i++) {
      const feature = productFeatures[i];
      console.log('🔧 Adding product feature:', feature.title);
      
      let featureX = margins.marginLeft;
      let featureHeight = 0;
      
      // Margine top per la prima caratteristica
      if (i === 0) {
        currentY += layout.productFeatures.icon.marginTop || 0;
      }
      
      // Icona caratteristica
      if (feature.icon_url) {
        const iconSizeMm = (layout.productFeatures.icon.iconSize || 16) / 3.78; // px to mm
        await addSvgIconToPdf(pdf, feature.icon_url, featureX, currentY, iconSizeMm);
        featureX += iconSizeMm + 3; // 3mm gap
        featureHeight = Math.max(featureHeight, iconSizeMm);
      }
      
      // Titolo caratteristica
      const titleHeight = addStyledText(
        pdf,
        feature.title,
        featureX,
        currentY,
        {
          fontSize: layout.productFeatures.title.fontSize || 12,
          fontFamily: layout.productFeatures.title.fontFamily || 'helvetica',
          fontStyle: layout.productFeatures.title.fontStyle || 'normal',
          fontColor: layout.productFeatures.title.fontColor || '#000000',
          alignment: layout.productFeatures.title.alignment || 'left',
          maxWidth: contentWidth - (featureX - margins.marginLeft)
        }
      );
      featureHeight = Math.max(featureHeight, titleHeight);
      
      currentY += featureHeight + (layout.productFeatures.icon.marginBottom || 5);
    }
  }
  
  console.log('✅ Allergens and product features page completed, final Y:', currentY.toFixed(1), 'mm');
};
