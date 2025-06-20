
import { useCallback } from 'react';

export const useAdvancedPrint = () => {
  const printMenuContent = useCallback(() => {
    console.log('🖨️ Avvio stampa avanzata del contenuto menu...');
    
    // Find the menu preview container
    const menuContainer = document.querySelector('.menu-print-preview-container');
    if (!menuContainer) {
      console.error('Menu container not found');
      return;
    }

    // Extract all page elements
    const pages = menuContainer.querySelectorAll('[data-page-preview]');
    if (pages.length === 0) {
      console.error('No pages found to print');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    // Get all stylesheets and fonts
    const stylesheets = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          if (sheet.href) {
            return `<link rel="stylesheet" href="${sheet.href}">`;
          } else if (sheet.ownerNode && sheet.ownerNode.textContent) {
            return `<style>${sheet.ownerNode.textContent}</style>`;
          }
        } catch (e) {
          console.warn('Could not access stylesheet:', e);
        }
        return '';
      })
      .join('\n');

    // Get Google Fonts links
    const fontLinks = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'))
      .map(link => link.outerHTML)
      .join('\n');

    // Clone and clean page content
    const cleanPages = Array.from(pages).map(page => {
      const clone = page.cloneNode(true) as HTMLElement;
      
      // Remove debug elements
      const elementsToRemove = [
        '.print\\:hidden',
        'button',
        '.border-dashed',
        '.absolute.top-3.left-3', // Page number badges
        'h3' // Page titles in preview
      ];
      
      elementsToRemove.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      return clone.outerHTML;
    }).join('');

    // Create complete HTML document
    const printHTML = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu - Stampa</title>
    ${fontLinks}
    ${stylesheets}
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        
        body {
            margin: 0;
            padding: 0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-family: system-ui, -apple-system, sans-serif;
        }
        
        .menu-print-preview-container {
            width: 210mm;
            margin: 0 auto;
        }
        
        [data-page-preview] {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            page-break-after: always;
            break-after: page;
            overflow: hidden;
            position: relative;
        }
        
        [data-page-preview]:last-child {
            page-break-after: auto;
            break-after: auto;
        }
        
        /* Remove card styling for clean print */
        .bg-card, .border, .shadow-sm, .rounded-lg {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
        }
        
        /* Ensure text is crisp */
        * {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Hide any remaining UI elements */
        .sticky, button, .border-dashed {
            display: none !important;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            [data-page-preview] {
                page-break-inside: avoid;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="menu-print-preview-container">
        ${cleanPages}
    </div>
    
    <script>
        // Auto-print when loaded
        window.onload = function() {
            setTimeout(function() {
                window.print();
                // Close window after print dialog
                setTimeout(function() {
                    window.close();
                }, 1000);
            }, 500);
        };
        
        // Handle print events
        window.onbeforeprint = function() {
            console.log('Starting print...');
        };
        
        window.onafterprint = function() {
            console.log('Print completed');
            window.close();
        };
    </script>
</body>
</html>`;

    // Write content to new window
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    console.log('✅ Print window created with', pages.length, 'pages');
    
  }, []);

  return {
    printMenuContent
  };
};
