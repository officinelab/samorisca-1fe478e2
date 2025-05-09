
// Handle restaurant logo in local storage
export const getStoredLogo = (): string | null => {
  return localStorage.getItem('restaurantLogo');
};

export const setStoredLogo = (logoUrl: string): void => {
  localStorage.setItem('restaurantLogo', logoUrl);
};
