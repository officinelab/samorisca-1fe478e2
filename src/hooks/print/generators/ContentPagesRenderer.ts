
import jsPDF from 'jspdf';
import { ContentPage, PageItem } from './ContentPageGenerator';
import { PrintLayout } from '@/types/printLayout';

export class ContentPagesRenderer {
  private pdf: jsPDF;
  private layout: PrintLayout;
  private pageWidth: number;
  private pageHeight: number;
  private language: string;

  constructor(
    pdf: jsPDF,
    layout: PrintLayout,
    pageWidth: number,
    pageHeight: number,
    language: string = 'it'
  ) {
    this.pdf = pdf;
    this.layout = layout;
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.language = language;
  }

  // Renderizza tutte le pagine del contenuto
  renderPages(pages: ContentPage[], startPageNumber: number, serviceChargeValue: string): void {
    pages.forEach((page, index) => {
      // Aggiungi nuova pagina (tranne per la prima)
      if (index > 0) {
        this.pdf.addPage();
      }

      const pageNumber = startPageNumber + index;
      const margins = this.getPageMargins(pageNumber);
      
      console.log(`📝 Renderizzazione pagina contenuto ${pageNumber}...`);
      
      this.renderPage(page, margins, serviceChargeValue);
    });
  }

  private renderPage(page: ContentPage, margins: any, serviceChargeValue: string): void {
    let currentY = margins.marginTop;

    // Renderizza tutti gli elementi della pagina
    for (const item of page.items) {
      currentY = this.renderPageItem(item, currentY, margins);
    }

    // Renderizza riga servizio in fondo alla pagina
    this.renderServiceRow(serviceChargeValue, margins);
  }

  private renderPageItem(item: PageItem, currentY: number, margins: any): number {
    switch (item.type) {
      case 'category-title':
        return this.renderCategoryTitle(item, currentY, margins);
      case 'category-notes':
        return this.renderCategoryNotes(item, currentY, margins);
      case 'product':
        return this.renderProduct(item, currentY, margins);
      default:
        return currentY;
    }
  }

  private renderCategoryTitle(item: PageItem, currentY: number, margins: any): number {
    if (!item.category) return currentY;

    const categoryConfig = this.layout.elements.category;
    const titleText = item.category[`title_${this.language}`] || item.category.title;
    const displayText = item.isRepeatedTitle ? `${titleText} (continua)` : titleText;

    // Applica stile categoria
    this.applyTextStyle(categoryConfig);
    
    currentY += categoryConfig.margin.top;
    
    // Posiziona testo in base all'allineamento
    const textX = this.getAlignedX(categoryConfig.alignment, margins);
    this.pdf.text(displayText, textX, currentY, { align: categoryConfig.alignment });
    
    currentY += this.ptToMm(categoryConfig.fontSize);
    currentY += this.layout.spacing.categoryTitleBottomMargin;
    
    console.log(`📝 Categoria renderizzata: ${displayText} a Y=${currentY}`);
    
    return currentY;
  }

  private renderCategoryNotes(item: PageItem, currentY: number, margins: any): number {
    if (!item.notes || item.notes.length === 0) return currentY;

    const notesConfig = this.layout.categoryNotes.text;
    this.applyTextStyle(notesConfig);

    currentY += notesConfig.margin.top;

    for (const note of item.notes) {
      const noteText = note[`text_${this.language}`] || note.text;
      const textX = this.getAlignedX(notesConfig.alignment, margins);
      
      this.pdf.text(noteText, textX, currentY, { align: notesConfig.alignment });
      currentY += this.ptToMm(notesConfig.fontSize) + 2; // Spazio tra note
    }

    currentY += notesConfig.margin.bottom;
    
    return currentY;
  }

  private renderProduct(item: PageItem, currentY: number, margins: any): number {
    if (!item.product) return currentY;

    const product = item.product;
    const elements = this.layout.elements;

    // Titolo prodotto
    this.applyTextStyle(elements.title);
    currentY += elements.title.margin.top;
    const titleX = this.getAlignedX(elements.title.alignment, margins);
    const titleText = product[`title_${this.language}`] || product.title;
    this.pdf.text(titleText, titleX, currentY, { align: elements.title.alignment });
    currentY += this.ptToMm(elements.title.fontSize) + elements.title.margin.bottom;

    // Descrizione prodotto
    if (product.description) {
      this.applyTextStyle(elements.description);
      currentY += elements.description.margin.top;
      const descX = this.getAlignedX(elements.description.alignment, margins);
      
      // Gestisci testo lungo con word wrap
      const descLines = this.pdf.splitTextToSize(product.description, this.getContentWidth(margins));
      this.pdf.text(descLines, descX, currentY, { align: elements.description.alignment });
      currentY += (descLines.length * this.ptToMm(elements.description.fontSize)) + elements.description.margin.bottom;
    }

    // Descrizione ENG
    const hasEngDescription = product[`description_${this.language}`] && 
      this.language !== 'it' && 
      product[`description_${this.language}`] !== product.description;
    
    if (hasEngDescription) {
      this.applyTextStyle(elements.descriptionEng);
      currentY += elements.descriptionEng.margin.top;
      const descEngX = this.getAlignedX(elements.descriptionEng.alignment, margins);
      
      const descEngLines = this.pdf.splitTextToSize(product[`description_${this.language}`], this.getContentWidth(margins));
      this.pdf.text(descEngLines, descEngX, currentY, { align: elements.descriptionEng.alignment });
      currentY += (descEngLines.length * this.ptToMm(elements.descriptionEng.fontSize)) + elements.descriptionEng.margin.bottom;
    }

    // Prezzo
    this.applyTextStyle(elements.price);
    currentY += elements.price.margin.top;
    const priceX = this.getAlignedX(elements.price.alignment, margins);
    let priceText = `€ ${product.price_standard}`;
    if (product.has_price_suffix && product.price_suffix) {
      priceText += ` ${product.price_suffix}`;
    }
    this.pdf.text(priceText, priceX, currentY, { align: elements.price.alignment });
    currentY += this.ptToMm(elements.price.fontSize) + elements.price.margin.bottom;

    // Allergeni
    if (product.allergens && product.allergens.length > 0) {
      this.applyTextStyle(elements.allergensList);
      currentY += elements.allergensList.margin.top;
      const allergensX = this.getAlignedX(elements.allergensList.alignment, margins);
      const allergensText = `Allergeni: ${product.allergens.map(a => a.number).join(', ')}`;
      this.pdf.text(allergensText, allergensX, currentY, { align: elements.allergensList.alignment });
      currentY += this.ptToMm(elements.allergensList.fontSize) + elements.allergensList.margin.bottom;
    }

    // Caratteristiche prodotto (icone)
    if (product.features && product.features.length > 0) {
      currentY += this.layout.elements.productFeatures.marginTop;
      // Per ora, mostra solo i nomi delle caratteristiche
      const featuresText = product.features.map(f => f.title).join(', ');
      this.pdf.setFontSize(8);
      this.pdf.text(featuresText, margins.marginLeft, currentY);
      currentY += 10 + this.layout.elements.productFeatures.marginBottom;
    }

    // Varianti prezzo
    if (product.has_multiple_prices) {
      this.applyTextStyle(elements.priceVariants);
      currentY += elements.priceVariants.margin.top;
      
      const variants = [];
      if (product.price_variant_1_name && product.price_variant_1_value) {
        variants.push(`${product.price_variant_1_name}: € ${product.price_variant_1_value}`);
      }
      if (product.price_variant_2_name && product.price_variant_2_value) {
        variants.push(`${product.price_variant_2_name}: € ${product.price_variant_2_value}`);
      }
      
      if (variants.length > 0) {
        const variantsX = this.getAlignedX(elements.priceVariants.alignment, margins);
        this.pdf.text(variants.join(' | '), variantsX, currentY, { align: elements.priceVariants.alignment });
        currentY += this.ptToMm(elements.priceVariants.fontSize) + elements.priceVariants.margin.bottom;
      }
    }

    // Spazio tra prodotti
    currentY += this.layout.spacing.betweenProducts;

    return currentY;
  }

  private renderServiceRow(serviceChargeValue: string, margins: any): void {
    const serviceConfig = this.layout.servicePrice;
    this.applyTextStyle(serviceConfig);
    
    const serviceY = this.pageHeight - margins.marginBottom - this.ptToMm(serviceConfig.fontSize);
    const serviceX = this.getAlignedX(serviceConfig.alignment, margins);
    const serviceText = `Servizio e Coperto = € ${serviceChargeValue}`;
    
    this.pdf.text(serviceText, serviceX, serviceY, { align: serviceConfig.alignment });
  }

  private applyTextStyle(config: any): void {
    const color = this.hexToRgb(config.fontColor || '#000000');
    this.pdf.setTextColor(color.r, color.g, color.b);
    this.pdf.setFontSize(config.fontSize || 12);
    
    const fontFamily = this.mapFontFamily(config.fontFamily || 'helvetica');
    const fontStyle = this.mapFontStyle(config.fontStyle || 'normal');
    
    try {
      this.pdf.setFont(fontFamily, fontStyle);
    } catch (e) {
      this.pdf.setFont('helvetica', fontStyle);
    }
  }

  private getAlignedX(alignment: string, margins: any): number {
    const contentWidth = this.getContentWidth(margins);
    
    switch (alignment) {
      case 'left':
        return margins.marginLeft;
      case 'right':
        return this.pageWidth - margins.marginRight;
      case 'center':
      default:
        return margins.marginLeft + (contentWidth / 2);
    }
  }

  private getContentWidth(margins: any): number {
    return this.pageWidth - margins.marginLeft - margins.marginRight;
  }

  private getPageMargins(pageNumber: number): any {
    const page = this.layout.page;
    
    if (page.useDistinctMarginsForPages) {
      const isOddPage = pageNumber % 2 === 1;
      return isOddPage ? 
        (page.oddPages || page) : 
        (page.evenPages || page);
    }
    
    return page;
  }

  private ptToMm(ptSize: number): number {
    return ptSize * 0.35;
  }

  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private mapFontFamily(fontFamily: string): string {
    const cleanFont = fontFamily.replace(/['"]/g, '').toLowerCase();
    
    if (cleanFont.includes('times') || (cleanFont.includes('serif') && !cleanFont.includes('sans'))) {
      return 'times';
    } else if (cleanFont.includes('courier') || cleanFont.includes('mono')) {
      return 'courier';
    } else {
      return 'helvetica';
    }
  }

  private mapFontStyle(fontStyle: string): string {
    const style = fontStyle?.toLowerCase() || '';
    if (style.includes('bold') && style.includes('italic')) return 'bolditalic';
    if (style.includes('bold')) return 'bold';
    if (style.includes('italic')) return 'italic';
    return 'normal';
  }
}
