
import { SiteSettings } from "./types";

/**
 * Default settings for the site
 */
export const defaultSettings: SiteSettings = {
  sidebarLogo: null,
  menuLogo: null,
  restaurantName: "Sa Morisca",
  footerText: `© ${new Date().getFullYear()} Sa Morisca - Tutti i diritti riservati`,
  adminTitle: "Sa Morisca Menu - Amministrazione",
  defaultProductImage: null,
  siteName: "Sa Morisca",
  siteDescription: "Ristorante Sa Morisca",
  showRestaurantNameInMenuBar: true,
  monthlyTokensLimit: "300", // Nuovo campo per il limite mensile dei token
};
