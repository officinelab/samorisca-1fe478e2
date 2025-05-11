
import { toast } from "@/components/ui/sonner";
import { saveSetting } from "./settingsStorage";

/**
 * Update the sidebar logo
 */
export const updateSidebarLogo = (logoUrl: string): boolean => {
  console.log("Updating sidebar logo:", logoUrl);
  if (saveSetting('sidebarLogo', logoUrl)) {
    toast.success("Logo della sidebar aggiornato");
    return true;
  }
  return false;
};

/**
 * Update the menu logo
 */
export const updateMenuLogo = (logoUrl: string): boolean => {
  console.log("Updating menu logo:", logoUrl);
  if (saveSetting('menuLogo', logoUrl)) {
    toast.success("Logo del menu aggiornato");
    return true;
  }
  return false;
};

/**
 * Update the restaurant name
 */
export const updateRestaurantName = (name: string): boolean => {
  if (saveSetting('restaurantName', name)) {
    toast.success("Nome del ristorante aggiornato");
    return true;
  }
  return false;
};

/**
 * Update the footer text
 */
export const updateFooterText = (text: string): boolean => {
  if (saveSetting('footerText', text)) {
    toast.success("Testo del footer aggiornato");
    return true;
  }
  return false;
};

/**
 * Update the default product image
 */
export const updateDefaultProductImage = (imageUrl: string): boolean => {
  console.log("Updating default product image:", imageUrl);
  if (saveSetting('defaultProductImage', imageUrl)) {
    toast.success("Immagine predefinita per i prodotti aggiornata");
    return true;
  }
  return false;
};
