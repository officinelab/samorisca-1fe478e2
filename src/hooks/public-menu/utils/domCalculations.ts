
// Utility functions for DOM calculations and measurements

export const waitForImages = async (): Promise<void> => {
  const images = document.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    
    return new Promise<void>((resolve) => {
      const handleLoad = () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleLoad);
        resolve();
      };
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleLoad);
      
      // Timeout di sicurezza
      setTimeout(handleLoad, 2000);
    });
  });
  
  await Promise.all(imagePromises);
};

export const calculateStickyOffset = async (): Promise<number> => {
  // Aspetta un frame per essere sicuri che il layout sia stabile
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  
  let totalOffset = 0;
  
  // Header principale
  const header = document.querySelector('header') as HTMLElement;
  if (header) {
    totalOffset += header.offsetHeight;
    console.log('Header height:', header.offsetHeight);
  }
  
  // CategorySidebar mobile
  const categorySidebar = document.querySelector('.sticky.top-\\[76px\\]') as HTMLElement || 
                         document.querySelector('[class*="sticky"][class*="top-"]') as HTMLElement;
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
