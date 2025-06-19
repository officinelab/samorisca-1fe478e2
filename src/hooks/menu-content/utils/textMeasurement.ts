
export const calculateTextHeight = (
  text: string,
  fontSize: number,
  fontFamily: string,
  maxWidth: number,
  lineHeight: number = 1.2
): number => {
  if (!text) return 0;
  
  // Create a virtual canvas to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return fontSize * lineHeight;

  context.font = `${fontSize}px ${fontFamily}`;
  const textWidth = context.measureText(text).width;
  const lines = Math.ceil(textWidth / maxWidth) || 1;
  
  return lines * fontSize * lineHeight;
};

export const MM_TO_PX = 3.78; // Conversion factor
