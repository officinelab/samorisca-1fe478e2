
/**
 * Font utilities for the application
 * This file centralizes font imports and configurations
 */

// Import Roboto font from @fontsource
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/**
 * Font families available in the application
 */
export const fontFamilies = {
  roboto: 'Roboto, sans-serif',
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

/**
 * Initialize fonts for the application
 * This should be called in the application entry point
 */
export const initializeFonts = () => {
  // Any additional font initialization logic can be added here
  console.log('Fonts initialized successfully');
}
