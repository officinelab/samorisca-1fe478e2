
/**
 * Given a restaurant logo (string|null|undefined) returns a valid src:
 * - Provided logo if present.
 * - Otherwise, a gray placeholder PNG in data URI.
 */
export function getCoverLogoUrl(restaurantLogo?: string | null): string {
  // Logo caricato dall'utente/ristorante
  if (restaurantLogo && typeof restaurantLogo === "string" && restaurantLogo.trim() !== "") {
    return restaurantLogo;
  }
  // Placeholder PNG 200x80, grigio chiaro
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAwCAYAAACbQhBnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB1UlEQVR4nO3bMW7CMBQF0fe/aua1b1DG0GkUhtuzs4AWzXnZh8bIZGYpdK3LWq0Ev2hJAQAAAAAAAAAAAACwvT5eehu9mbB72rzfB28G5zpMvtzKXn0FQ0jhnA4NSxDFDVZ8I0i6DEiaDEmaHLSIwTXZyFoE9Jp4k8V7hjwrP9Dpr6eDuK4whX3KsKpEycP57q6Hwp+Mh74uRj6cgb8pd7ZPXxaZ1USLiaWJV7GMlo60lsw+jZyKc0bTSvnX1uZt97rKp4PyR3CGDV0RZZHEjRPslPOspP6qRWWRVC+It7Nayta4uwET/TXwXWXuba/QPKklj4Kp4+CRslPCNnD4TjdJ7HGn6r/U/yCScx9N6p/DDdaoRh/SbUg8cQYT2vm1bUa03o6Z0nrITfFJ22IoO9PBnVDfalrlD9+MnUh3Wu6S9I0bbuAgAAAAAAAAAAAABQ/IQSzWSnmXqfRwAAAABJRU5ErkJggg==";
}
