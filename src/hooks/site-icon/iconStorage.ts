
import { toast } from "@/components/ui/sonner";

/**
 * Save site icon to localStorage for backwards compatibility
 */
export const saveIconToLocalStorage = (iconUrl: string | null): void => {
  if (iconUrl) {
    localStorage.setItem('siteIcon', iconUrl);
  } else {
    localStorage.removeItem('siteIcon');
  }
};

/**
 * Load site icon from localStorage (fallback method)
 */
export const loadIconFromLocalStorage = (): string | null => {
  return localStorage.getItem('siteIcon');
};

/**
 * Show a toast notification after updating the site icon
 */
export const notifyIconUpdate = (wasRemoved: boolean = false): void => {
  if (wasRemoved) {
    toast.success("Icona del sito rimossa");
  } else {
    toast.success("Icona del sito aggiornata");
  }
};
