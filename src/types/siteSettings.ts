
/**
 * Type definition for site settings
 */
export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  openingHours?: Record<string, string>;
  socialLinks?: Record<string, string>;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  logoUrl?: string;
  faviconUrl?: string;
  sidebarLogo?: string;
  menuLogo?: string;
  restaurantName?: string;
  footerText?: string;
  defaultProductImage?: string;
  [key: string]: any;
}
