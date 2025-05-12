
import { SiteSettings } from "./types";

/**
 * Impostazioni predefinite del sito
 */
export const defaultSettings: SiteSettings = {
  siteName: "Menu Manager",
  siteDescription: "Gestione menu per ristoranti",
  sidebarLogo: null,
  menuLogo: null,
  menuTitle: "Menu",
  menuSubtitle: "Ristorante",
  restaurantName: "Ristorante",
  footerText: `© ${new Date().getFullYear()} - Tutti i diritti riservati`,
  adminTitle: "Menu Manager - Admin",
  defaultProductImage: null
};
