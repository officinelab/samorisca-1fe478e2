
import jsPDF from 'jspdf';

// Function for adding images to PDF with correct positioning
export const addImageToPdf = async (
  pdf: jsPDF,
  imageUrl: string,
  y: number,
  maxWidthPercent: number,
  maxHeightPercent: number,
  alignment: 'left' | 'center' | 'right' = 'center',
  pageWidth: number = 210,
  pageHeight: number = 297,
  leftMargin: number = 0,
  rightMargin: number = 0,
  topMargin: number = 0,
  bottomMargin: number = 0
): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const contentWidth = pageWidth - leftMargin - rightMargin;
      const contentHeight = pageHeight - topMargin - bottomMargin;
      
      const maxWidthMm = contentWidth * (maxWidthPercent / 100);
      const maxHeightMm = contentHeight * (maxHeightPercent / 100);
      
      const imgRatio = img.width / img.height;
      let finalWidth = maxWidthMm;
      let finalHeight = maxWidthMm / imgRatio;
      
      if (finalHeight > maxHeightMm) {
        finalHeight = maxHeightMm;
        finalWidth = maxHeightMm * imgRatio;
      }
      
      let finalX = leftMargin;
      
      switch (alignment) {
        case 'left':
          finalX = leftMargin;
          break;
        case 'right':
          finalX = pageWidth - rightMargin - finalWidth;
          break;
        case 'center':
        default:
          finalX = leftMargin + (contentWidth - finalWidth) / 2;
          break;
      }
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.95),
          'JPEG',
          finalX,
          y,
          finalWidth,
          finalHeight
        );
        
        resolve(finalHeight);
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        resolve(0);
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image:', imageUrl);
      resolve(0);
    };
    
    img.src = imageUrl;
  });
};
