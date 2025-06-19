
import jsPDF from 'jspdf';

// High-quality SVG to PNG conversion for PDF icons
export const addSvgIconToPdf = async (
  pdf: jsPDF,
  iconUrl: string,
  x: number,
  y: number,
  size: number
): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create high-resolution canvas for better quality
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Use 2x resolution for better quality
        const resolution = 2;
        const actualSize = size * resolution;
        canvas.width = actualSize;
        canvas.height = actualSize;
        
        if (ctx) {
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Fill with transparent background
          ctx.clearRect(0, 0, actualSize, actualSize);
          
          // Draw the SVG image at high resolution
          ctx.drawImage(img, 0, 0, actualSize, actualSize);
          
          // Convert size to mm (1px ≈ 0.264583mm)
          const sizeMm = size * 0.264583;
          
          // Add to PDF as high-quality PNG
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          pdf.addImage(dataUrl, 'PNG', x, y, sizeMm, sizeMm);
          
          resolve(sizeMm);
        } else {
          resolve(0);
        }
      } catch (error) {
        console.error('Error adding SVG icon to PDF:', error);
        resolve(0);
      }
    };
    
    img.onerror = () => {
      console.error('Error loading SVG icon:', iconUrl);
      resolve(0);
    };
    
    img.src = iconUrl;
  });
};
