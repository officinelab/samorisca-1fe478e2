
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { Category } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import CategoryRenderer from '@/components/menu-print/CategoryRenderer';
import { MEASUREMENT_DELAY, PX_TO_MM } from './constants';
import { MeasurementResult } from './types';

export const measureCategories = async (
  container: HTMLDivElement,
  categories: Category[],
  categoryNotes: CategoryNote[],
  categoryNotesRelations: Record<string, string[]>,
  layout: PrintLayout,
  results: MeasurementResult
): Promise<void> => {
  for (const category of categories) {
    // Renderizza il componente reale per misurazioni accurate
    const categoryWrapper = document.createElement('div');
    container.innerHTML = '';
    container.appendChild(categoryWrapper);
    
    // Crea un mini React root per renderizzare il componente reale
    const root = createRoot(categoryWrapper);
    
    // Note della categoria
    const relatedNoteIds = categoryNotesRelations[category.id] || [];
    const relatedNotes = categoryNotes.filter(note => relatedNoteIds.includes(note.id));
    
    // Renderizza il CategoryRenderer reale
    await new Promise<void>(resolve => {
      root.render(
        React.createElement(CategoryRenderer, {
          category,
          notes: relatedNotes,
          layout,
          isRepeatedTitle: false
        })
      );
      setTimeout(resolve, MEASUREMENT_DELAY);
    });
    
    // Misura l'altezza totale della categoria (titolo + note)
    const categoryTotalHeight = categoryWrapper.getBoundingClientRect().height * PX_TO_MM;
    results.categoryHeights.set(category.id, categoryTotalHeight);
    
    console.log('🔧 usePreRenderMeasurement - Categoria "' + category.title + '" altezza:', {
      heightPx: categoryWrapper.getBoundingClientRect().height,
      heightMm: categoryTotalHeight,
      hasNotes: relatedNotes.length > 0
    });
    
    // Misura anche le singole note per riferimento
    relatedNotes.forEach((note, index) => {
      // Approssima l'altezza di ogni nota basandosi sul totale
      const estimatedNoteHeight = 8; // Ridotto da 10mm a 8mm
      results.categoryNoteHeights.set(note.id, estimatedNoteHeight);
    });
    
    root.unmount();
  }
};
