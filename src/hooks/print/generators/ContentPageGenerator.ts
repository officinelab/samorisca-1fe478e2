
import { Category, Product } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { calculateCategoryHeight, calculateAvailablePageHeight, calculateServiceRowHeight } from '../utils/heightCalculations';

export interface PageItem {
  type: 'category-title' | 'category-notes' | 'product';
  categoryId: string;
  category?: Category;
  product?: Product;
  notes?: any[];
  isRepeatedTitle?: boolean;
}

export interface ContentPage {
  pageNumber: number;
  items: PageItem[];
  usedHeight: number;
  availableHeight: number;
}

export class ContentPageGenerator {
  private layout: PrintLayout;
  private pageHeight: number;
  private margins: { marginTop: number; marginBottom: number };
  private serviceRowHeight: number;
  private availablePageHeight: number;
  private language: string;

  constructor(
    layout: PrintLayout,
    pageHeight: number,
    margins: { marginTop: number; marginBottom: number },
    language: string = 'it'
  ) {
    this.layout = layout;
    this.pageHeight = pageHeight;
    this.margins = margins;
    this.language = language;
    this.serviceRowHeight = calculateServiceRowHeight(layout);
    this.availablePageHeight = calculateAvailablePageHeight(pageHeight, margins, this.serviceRowHeight);
  }

  // Genera tutte le pagine del contenuto
  generatePages(
    categories: Category[],
    products: Record<string, Product[]>,
    selectedCategories: string[],
    categoryNotes: Record<string, any[]> = {}
  ): ContentPage[] {
    const pages: ContentPage[] = [];
    let currentPage: ContentPage = this.createNewPage(pages.length + 1);
    
    const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));

    console.log(`🏗️ Generazione pagine per ${filteredCategories.length} categorie con schema: ${this.layout.productSchema}`);

    for (const category of filteredCategories) {
      const categoryProducts = products[category.id] || [];
      const notes = categoryNotes[category.id] || [];
      
      console.log(`📂 Processando categoria: ${category.title} con ${categoryProducts.length} prodotti`);
      
      // Calcola dimensioni della categoria
      const categoryDimensions = calculateCategoryHeight(
        category, 
        categoryProducts, 
        this.layout, 
        notes, 
        this.language
      );

      // Se la categoria intera non entra nella pagina corrente, crea nuova pagina
      if (currentPage.usedHeight + categoryDimensions.totalHeight > this.availablePageHeight && currentPage.items.length > 0) {
        console.log(`📄 Creando nuova pagina per categoria: ${category.title}`);
        pages.push(currentPage);
        currentPage = this.createNewPage(pages.length + 1);
      }

      // Aggiungi titolo categoria
      const titleHeight = categoryDimensions.title.height + categoryDimensions.title.marginTop + categoryDimensions.title.marginBottom;
      this.addItemToPage(currentPage, {
        type: 'category-title',
        categoryId: category.id,
        category,
        isRepeatedTitle: false
      }, titleHeight);

      // Aggiungi note categoria (se presenti)
      if (categoryDimensions.notes) {
        const notesHeight = categoryDimensions.notes.height + categoryDimensions.notes.marginTop + categoryDimensions.notes.marginBottom;
        this.addItemToPage(currentPage, {
          type: 'category-notes',
          categoryId: category.id,
          category,
          notes
        }, notesHeight);
      }

      // Aggiungi prodotti uno per uno
      for (let i = 0; i < categoryProducts.length; i++) {
        const product = categoryProducts[i];
        const productHeight = categoryDimensions.products[i].totalHeight;

        console.log(`🍽️ Processando prodotto: ${product.title} (altezza: ${productHeight}mm)`);

        // Se il prodotto non entra, crea nuova pagina e ripeti il titolo categoria
        if (currentPage.usedHeight + productHeight > this.availablePageHeight) {
          console.log(`📄 Prodotto non entra, creando nuova pagina e ripetendo titolo categoria`);
          pages.push(currentPage);
          currentPage = this.createNewPage(pages.length + 1);
          
          // Ripeti titolo categoria
          this.addItemToPage(currentPage, {
            type: 'category-title',
            categoryId: category.id,
            category,
            isRepeatedTitle: true
          }, titleHeight);
        }

        // Aggiungi prodotto
        this.addItemToPage(currentPage, {
          type: 'product',
          categoryId: category.id,
          category,
          product
        }, productHeight);
      }
    }

    // Aggiungi l'ultima pagina se contiene elementi
    if (currentPage.items.length > 0) {
      pages.push(currentPage);
    }

    console.log(`✅ Generazione completata: ${pages.length} pagine create`);
    return pages;
  }

  private createNewPage(pageNumber: number): ContentPage {
    return {
      pageNumber,
      items: [],
      usedHeight: 0,
      availableHeight: this.availablePageHeight
    };
  }

  private addItemToPage(page: ContentPage, item: PageItem, height: number): void {
    page.items.push(item);
    page.usedHeight += height;
    page.availableHeight = this.availablePageHeight - page.usedHeight;
    
    console.log(`➕ Aggiunto ${item.type} alla pagina ${page.pageNumber}, altezza usata: ${page.usedHeight}mm`);
  }
}
