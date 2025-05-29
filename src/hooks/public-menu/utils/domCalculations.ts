
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
  
  // CategorySidebar mobile - con il nuovo positioning non contribuisce più all'offset
  // dato che ora usa margin-top invece di top
  const categorySidebar = document.getElementById('mobile-category-sidebar') as HTMLElement;
  if (categorySidebar && categorySidebar.style.marginTop) {
    // Se la sidebar ha margin-top, significa che è già posizionata correttamente
    console.log('CategorySidebar positioned with margin-top');
  } else if (categorySidebar) {
    // Fallback per altri casi
    totalOffset += categorySidebar.offsetHeight;
    console.log('CategorySidebar height (fallback):', categorySidebar.offsetHeight);
  }
  
  // Padding extra ridotto dato che ora il positioning è più preciso
  const extraPadding = 10;
  totalOffset += extraPadding;
  
  console.log('Total calculated offset:', totalOffset);
  return totalOffset;
};
