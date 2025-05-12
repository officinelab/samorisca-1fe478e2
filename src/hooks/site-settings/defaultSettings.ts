
import { SiteSettings } from "./types";

/**
 * Default site settings
 */
export const defaultSettings: SiteSettings = {
  sidebarLogo: null,
  menuLogo: null,
  defaultProductImage: null,
  restaurantName: "Sa Morisca",
  footerText: `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`,
  headerTitle: "Sa Morisca Menu - Amministrazione"
};
