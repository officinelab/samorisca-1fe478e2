
/**
 * Utility functions for style transformations in PDF rendering
 */

// Maps our custom alignment values to valid @react-pdf/renderer values
export const mapAlignment = (alignment: 'left' | 'center' | 'right'): 'flex-start' | 'center' | 'flex-end' => {
  switch (alignment) {
    case 'left': return 'flex-start';
    case 'center': return 'center';
    case 'right': return 'flex-end';
    default: return 'center';
  }
};
