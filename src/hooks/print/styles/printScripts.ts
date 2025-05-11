
/**
 * Script to add page numbers and trigger printing
 */
export const getPrintScript = (): string => {
  return `
    window.onload = function() {
      // Add page numbers
      const pages = document.querySelectorAll('.page');
      pages.forEach((page, index) => {
        if (index > 0) { // Skip the cover page
          const pageNumber = document.createElement('div');
          pageNumber.className = 'page-number';
          pageNumber.textContent = index;
          page.appendChild(pageNumber);
        }
      });
      
      // Trigger print dialog after a short delay
      setTimeout(function() {
        window.print();
        // setTimeout(function() { window.close(); }, 500);
      }, 500);
    };
  `;
};
