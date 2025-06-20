
import { createRoot } from 'react-dom/client';
import React from 'react';
import { PX_TO_MM } from '../constants/measurementConstants';

interface BatchMeasurementItem {
  id: string;
  element: React.ReactElement;
  description: string;
}

export const measureElementsBatch = async (
  container: HTMLDivElement,
  items: BatchMeasurementItem[],
  delay: number = 50
): Promise<Map<string, number>> => {
  const results = new Map<string, number>();
  
  // Create a wrapper for all elements
  const batchWrapper = document.createElement('div');
  container.innerHTML = '';
  container.appendChild(batchWrapper);
  
  // Create individual containers for each element
  const elementContainers = new Map<string, HTMLDivElement>();
  
  items.forEach(item => {
    const elementDiv = document.createElement('div');
    elementDiv.setAttribute('data-measurement-id', item.id);
    batchWrapper.appendChild(elementDiv);
    elementContainers.set(item.id, elementDiv);
  });
  
  // Render all elements at once
  const roots = new Map<string, any>();
  
  items.forEach(item => {
    const elementContainer = elementContainers.get(item.id)!;
    const root = createRoot(elementContainer);
    roots.set(item.id, root);
    root.render(item.element);
  });
  
  // Wait for all elements to render
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Measure all elements
  items.forEach(item => {
    const elementContainer = elementContainers.get(item.id)!;
    const height = elementContainer.getBoundingClientRect().height * PX_TO_MM;
    results.set(item.id, height);
    
    console.log(`🔧 Batch measured ${item.description}: ${height.toFixed(2)}mm`);
  });
  
  // Cleanup all roots
  roots.forEach(root => root.unmount());
  
  return results;
};
