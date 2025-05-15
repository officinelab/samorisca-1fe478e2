import { toast } from "@/components/ui/sonner";
import { saveSetting } from "./settingsStorage";

/**
 * Update the sidebar logo
 */
export const updateSidebarLogo = (logoUrl: string): boolean => {
  console.log("Updating sidebar logo:", logoUrl);
  if (saveSetting('sidebarLogo', logoUrl)) {
    // Force an event dispatch to notify components that depend on this setting
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'sidebarLogo', value: logoUrl } 
    }));
    
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
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'menuLogo', value: logoUrl } 
    }));
    
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
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'restaurantName', value: name } 
    }));
    
    toast.success("Nome del ristorante aggiornato");
    return true;
  }
  return false;
};

/**
 * Update the admin title
 */
export const updateAdminTitle = (title: string): boolean => {
  if (saveSetting('adminTitle', title)) {
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'adminTitle', value: title } 
    }));
    
    toast.success("Titolo dell'intestazione aggiornato");
    return true;
  }
  return false;
};

/**
 * Update the footer text
 */
export const updateFooterText = (text: string): boolean => {
  if (saveSetting('footerText', text)) {
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'footerText', value: text } 
    }));
    
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
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'defaultProductImage', value: imageUrl } 
    }));
    
    toast.success("Immagine predefinita per i prodotti aggiornata");
    return true;
  }
  return false;
};

/**
 * Update the service & cover charge price
 */
export const updateServiceCoverCharge = (price: number): boolean => {
  if (saveSetting('serviceCoverCharge', price)) {
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'serviceCoverCharge', value: price } 
    }));
    toast.success("Servizio e coperto aggiornato");
    return true;
  }
  return false;
};

/**
 * Update showPricesInOrder toggle
 */
export const updateShowPricesInOrder = (value: boolean): boolean => {
  if (saveSetting('showPricesInOrder', value)) {
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { 
      detail: { key: 'showPricesInOrder', value } 
    }));
    toast.success("Preferenza visualizzazione prezzi aggiornata");
    return true;
  }
  return false;
};
