import jsPDF from 'jspdf';

// High-quality SVG to PNG conversion for PDF icons - FIXED
export const addSvgIconToPdf = async (
  pdf: jsPDF,
  iconUrl: string,
  x: number,
  y: number,
  sizeMm: number
): Promise<number> => {
  return new Promise((resolve) => {
    console.log(`🎯 Loading icon from: ${iconUrl}`);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        console.log(`🎯 Icon loaded successfully, size: ${img.width}x${img.height}`);
        
        // Create high-resolution canvas for better quality
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('🎯 Failed to get canvas context');
          resolve(0);
          return;
        }
        
        // Use higher resolution for better quality in PDF
        const resolution = 3; // Aumentato da 2 a 3 per migliore qualità
        const canvasSize = Math.round(sizeMm * 11.81 * resolution); // mm to px at high res
        
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        
        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Fill with transparent background
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        
        // Draw the SVG image at high resolution
        ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
        
        // Add to PDF as high-quality PNG
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
        console.log(`🎯 Adding icon to PDF at position (${x.toFixed(1)}, ${y.toFixed(1)}) with size ${sizeMm.toFixed(2)}mm`);
        
        pdf.addImage(dataUrl, 'PNG', x, y, sizeMm, sizeMm);
        
        // Cleanup
        canvas.remove();
        
        console.log(`🎯 Icon successfully added to PDF`);
        resolve(sizeMm);
        
      } catch (error) {
        console.error('🎯 Error processing icon for PDF:', error);
        resolve(0);
      }
    };
    
    img.onerror = (error) => {
      console.error('🎯 Error loading icon:', iconUrl, error);
      resolve(0);
    };
    
    // Add timestamp to prevent caching issues
    const separator = iconUrl.includes('?') ? '&' : '?';
    img.src = `${iconUrl}${separator}t=${Date.now()}`;
  });
};