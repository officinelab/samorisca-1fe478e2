
export const DEFAULT_FONT_SETTINGS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: 18 },
    mobile: { fontSize: 18 },
    detail: { fontSize: 18 }
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
    desktop: { fontSize: 14 },
    mobile: { fontSize: 14 },
    detail: { fontSize: 16 }
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    desktop: { fontSize: 16 },
    mobile: { fontSize: 16 },
    detail: { fontSize: 18 }
  }
};

export function initializeCompleteFontSettings(siteSettings: any, selectedLayout: string) {
  const saved = siteSettings?.publicMenuFontSettings?.[selectedLayout];

  return {
    title: {
      fontFamily: saved?.title?.fontFamily || "Poppins",
      fontWeight: saved?.title?.fontWeight || "bold",
      fontStyle: saved?.title?.fontStyle || "normal",
      desktop: { fontSize: saved?.title?.desktop?.fontSize || 18 },
      mobile: { fontSize: saved?.title?.mobile?.fontSize || 18 },
      detail: { fontSize: saved?.title?.detail?.fontSize || 18 }
    },
    description: {
      fontFamily: saved?.description?.fontFamily || "Open Sans",
      fontWeight: saved?.description?.fontWeight || "normal",
      fontStyle: saved?.description?.fontStyle || "normal",
      desktop: { fontSize: saved?.description?.desktop?.fontSize || 14 },
      mobile: { fontSize: saved?.description?.mobile?.fontSize || 14 },
      detail: { fontSize: saved?.description?.detail?.fontSize || 16 }
    },
    price: {
      fontFamily: saved?.price?.fontFamily || "Poppins",
      fontWeight: saved?.price?.fontWeight || "bold",
      fontStyle: saved?.price?.fontStyle || "normal",
      desktop: { fontSize: saved?.price?.desktop?.fontSize || 16 },
      mobile: { fontSize: saved?.price?.mobile?.fontSize || 16 },
      detail: { fontSize: saved?.price?.detail?.fontSize || 18 }
    }
  };
}

export function truncateText(text: string | null = "", maxLength: number = 120) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

