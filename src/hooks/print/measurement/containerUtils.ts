
export const createMeasurementContainer = (contentWidth: number): HTMLDivElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: ${210}mm;
    visibility: hidden;
    pointer-events: none;
    z-index: -1;
  `;
  
  // Set the specific content width
  container.style.width = `${contentWidth}mm`;
  container.style.padding = '0';
  container.style.boxSizing = 'border-box';
  
  document.body.appendChild(container);
  return container;
};

export const cleanupMeasurementContainer = (container: HTMLDivElement | null) => {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
};
