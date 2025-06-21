
import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrintLayout } from '@/types/printLayout';
import { Allergen, ProductFeature } from '@/types/database';
import AllergenItem from '@/components/menu-print/allergens/AllergenItem';
import ProductFeatureItem from '@/components/menu-print/allergens/ProductFeatureItem';
import { MEASUREMENT_DELAY, PX_TO_MM } from '../constants/measurementConstants';

export const renderAndMeasureElement = async (
  container: HTMLDivElement,
  element: React.ReactElement,
  description: string
): Promise<number> => {
  const wrapper = document.createElement('div');
  container.innerHTML = '';
  container.appendChild(wrapper);
  
  const root = createRoot(wrapper);
  
  await new Promise<void>(resolve => {
    root.render(element);
    setTimeout(resolve, MEASUREMENT_DELAY);
  });
  
  const height = wrapper.getBoundingClientRect().height * PX_TO_MM;
  console.log(`🏷️ ${description} altezza:`, height);
  
  root.unmount();
  return height;
};

export const createTitleElement = (layout: PrintLayout) => {
  // Controlla se il titolo è visibile
  if (layout.allergens.title.visible === false) {
    return React.createElement('div', { style: { display: 'none' } });
  }

  return React.createElement('div', {
    style: {
      fontSize: `${layout.allergens.title.fontSize}px`,
      fontFamily: layout.allergens.title.fontFamily,
      color: layout.allergens.title.fontColor,
      fontWeight: layout.allergens.title.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: layout.allergens.title.fontStyle === 'italic' ? 'italic' : 'normal',
      textAlign: layout.allergens.title.alignment as any,
      marginTop: `${layout.allergens.title.margin.top}mm`,
      marginBottom: `${layout.allergens.title.margin.bottom}mm`,
      marginLeft: `${layout.allergens.title.margin.left}mm`,
      marginRight: `${layout.allergens.title.margin.right}mm`,
      lineHeight: 1.3
    }
  }, layout.allergens.title.text || 'Allergeni e Intolleranze');
};

export const createDescriptionElement = (layout: PrintLayout) => {
  // Controlla se la descrizione è visibile
  if (layout.allergens.description.visible === false) {
    return React.createElement('div', { style: { display: 'none' } });
  }

  return React.createElement('div', {
    style: {
      fontSize: `${layout.allergens.description.fontSize}px`,
      fontFamily: layout.allergens.description.fontFamily,
      color: layout.allergens.description.fontColor,
      fontWeight: layout.allergens.description.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: layout.allergens.description.fontStyle === 'italic' ? 'italic' : 'normal',
      textAlign: layout.allergens.description.alignment as any,
      marginTop: `${layout.allergens.description.margin.top}mm`,
      marginBottom: `${layout.allergens.description.margin.bottom}mm`,
      marginLeft: `${layout.allergens.description.margin.left}mm`,
      marginRight: `${layout.allergens.description.margin.right}mm`,
      lineHeight: 1.4
    }
  }, layout.allergens.description.text || 'Lista completa degli allergeni presenti nei nostri prodotti');
};

export const createAllergenElement = (allergen: Allergen, layout: PrintLayout) => {
  return React.createElement(AllergenItem, {
    allergen: allergen,
    layout: layout
  });
};

export const createProductFeatureElement = (feature: ProductFeature, layout: PrintLayout, isFirst: boolean) => {
  return React.createElement(ProductFeatureItem, {
    feature: feature,
    layout: layout,
    isFirst: isFirst
  });
};

// Nuovo elemento per creare il titolo della sezione caratteristiche prodotto
export const createProductFeaturesSectionElement = (layout: PrintLayout) => {
  const sectionTitleConfig = layout.productFeatures?.sectionTitle;
  
  if (sectionTitleConfig?.visible === false) {
    return React.createElement('div', { style: { display: 'none' } });
  }

  return React.createElement('div', {
    style: {
      fontSize: `${sectionTitleConfig?.fontSize || 18}px`,
      fontFamily: sectionTitleConfig?.fontFamily || 'Arial',
      color: sectionTitleConfig?.fontColor || '#000000',
      fontWeight: sectionTitleConfig?.fontStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: sectionTitleConfig?.fontStyle === 'italic' ? 'italic' : 'normal',
      textAlign: sectionTitleConfig?.alignment as any || 'left',
      marginTop: `${sectionTitleConfig?.margin?.top || 5}mm`,
      marginBottom: `${sectionTitleConfig?.margin?.bottom || 10}mm`,
      marginLeft: `${sectionTitleConfig?.margin?.left || 0}mm`,
      marginRight: `${sectionTitleConfig?.margin?.right || 0}mm`,
      lineHeight: 1.3
    }
  }, sectionTitleConfig?.text || 'Caratteristiche Prodotto');
};
