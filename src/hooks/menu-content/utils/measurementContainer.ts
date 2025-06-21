
export const createMeasurementContainer = (contentWidth: number): HTMLDivElement => {
  const container = document.createElement('div');
  
  // Stili per simulare l'ambiente di stampa reale
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = `${contentWidth}mm`;
  container.style.height = 'auto';
  container.style.visibility = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.fontSize = '12px'; // Font size di base
  container.style.fontFamily = 'Arial, sans-serif'; // Font di base
  container.style.lineHeight = '1.2';
  container.style.color = '#000000';
  container.style.backgroundColor = 'white';
  container.style.overflow = 'visible';
  container.style.boxSizing = 'border-box';
  container.style.padding = '0';
  container.style.margin = '0';
  
  // Aggiungi al DOM per permettere la misurazione
  document.body.appendChild(container);
  
  console.log(`📏 Container di misurazione creato: ${contentWidth}mm di larghezza`);
  
  return container;
};

export const cleanupMeasurementContainer = (container: HTMLDivElement | null) => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
    console.log('📏 Container di misurazione rimosso');
  }
};
