
/**
 * Update the favicon in the DOM
 * @param iconUrl URL of the icon to set as favicon
 */
export const updateFaviconInDOM = (iconUrl: string | null): void => {
  if (!iconUrl) return;
  
  // Look for existing favicon link element
  let link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  
  // Create one if it doesn't exist
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  
  // Update href and type
  link.href = iconUrl;
  link.type = 'image/svg+xml';
};
