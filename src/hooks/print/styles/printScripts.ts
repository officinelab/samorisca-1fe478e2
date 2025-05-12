
/**
 * Script to add page numbers and trigger printing
 */
export const getPrintScript = (): string => {
  return `
    window.onload = function() {
      // Add page numbers
      const pages = document.querySelectorAll('.page');
      pages.forEach((page, index) => {
        // Skip numbering for cover page (page 0)
        if (!page.classList.contains('cover-page') && index > 0) { 
          const pageNumber = document.createElement('div');
          pageNumber.className = 'page-number';
          pageNumber.textContent = (index); // La pagina 1 inizia dopo la copertina
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
