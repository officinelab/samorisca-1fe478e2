
/**
 * Site settings record in the database
 */
export interface SiteSettingRecord {
  id: string;
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}

/**
 * Site settings object
 */
export interface SiteSettings {
  sidebarLogo?: string | null;
  menuLogo?: string | null;
  defaultProductImage?: string | null;
  restaurantName?: string;
  footerText?: string;
  headerTitle?: string;
  faviconUrl?: string | null;
}
