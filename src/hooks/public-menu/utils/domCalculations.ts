
// Utility functions for DOM calculations and measurements

export const waitForDOMReady = (): Promise<void> => {
  return new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      // DOM is already ready, wait one frame for layout
      requestAnimationFrame(() => resolve());
    }
  });
};

export const calculateStickyOffset = async (): Promise<number> => {
  // Aspetta che il DOM sia pronto
  await waitForDOMReady();
  
  let totalOffset = 0;
  
  // Header principale
  const header = document.querySelector('header') as HTMLElement;
  if (header) {
    totalOffset += header.offsetHeight;
    console.log('Header height:', header.offsetHeight);
  }
  
  // CategorySidebar mobile - usa il nuovo selettore più specifico
  const categorySidebar = document.getElementById('mobile-category-sidebar') as HTMLElement || 
                         document.querySelector('[data-sidebar="mobile"]') as HTMLElement;
  if (categorySidebar) {
    totalOffset += categorySidebar.offsetHeight;
    console.log('CategorySidebar height:', categorySidebar.offsetHeight);
  }
  
  // Padding extra per sicurezza
  const extraPadding = 20;
  totalOffset += extraPadding;
  
  console.log('Total calculated offset:', totalOffset);
  return totalOffset;
};
