
interface FontConfigItem {
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  desktop: { fontSize: number };
  mobile: { fontSize: number };
  detail: { fontSize: number };
}

interface FontConfig {
  title: FontConfigItem;
  description: FontConfigItem;
  price: FontConfigItem;
}

interface SiteSettings {
  publicMenuFontSettings?: Record<string, FontConfig>;
}

export const useFontSettings = (siteSettings: SiteSettings | null, layoutType: string) => {
  const defaultFontSettings = {
    title: { fontFamily: "Poppins", fontWeight: "bold", fontStyle: "normal", desktop: { fontSize: 18 }, mobile: { fontSize: 18 }, detail: { fontSize: 18 } },
    description: { fontFamily: "Open Sans", fontWeight: "normal", fontStyle: "normal", desktop: { fontSize: 14 }, mobile: { fontSize: 14 }, detail: { fontSize: 16 } },
    price: { fontFamily: "Poppins", fontWeight: "bold", fontStyle: "normal", desktop: { fontSize: 16 }, mobile: { fontSize: 16 }, detail: { fontSize: 18 } }
  } as FontConfig;

  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const fontSettingsConfig = publicMenuFontSettings?.[layoutType] || {};

  const fontSettings = {
    title: {
      fontFamily: fontSettingsConfig?.title?.fontFamily || defaultFontSettings.title.fontFamily,
      fontWeight: fontSettingsConfig?.title?.fontWeight || defaultFontSettings.title.fontWeight,
      fontStyle: fontSettingsConfig?.title?.fontStyle || defaultFontSettings.title.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.title?.desktop?.fontSize || defaultFontSettings.title.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.title?.mobile?.fontSize || defaultFontSettings.title.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.title?.detail?.fontSize || defaultFontSettings.title.detail.fontSize }
    },
    description: {
      fontFamily: fontSettingsConfig?.description?.fontFamily || defaultFontSettings.description.fontFamily,
      fontWeight: fontSettingsConfig?.description?.fontWeight || defaultFontSettings.description.fontWeight,
      fontStyle: fontSettingsConfig?.description?.fontStyle || defaultFontSettings.description.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.description?.desktop?.fontSize || defaultFontSettings.description.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.description?.mobile?.fontSize || defaultFontSettings.description.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.description?.detail?.fontSize || defaultFontSettings.description.detail.fontSize }
    },
    price: {
      fontFamily: fontSettingsConfig?.price?.fontFamily || defaultFontSettings.price.fontFamily,
      fontWeight: fontSettingsConfig?.price?.fontWeight || defaultFontSettings.price.fontWeight,
      fontStyle: fontSettingsConfig?.price?.fontStyle || defaultFontSettings.price.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.price?.desktop?.fontSize || defaultFontSettings.price.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.price?.mobile?.fontSize || defaultFontSettings.price.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.price?.detail?.fontSize || defaultFontSettings.price.detail.fontSize }
    }
  };

  const getCardFontSettings = (view: 'mobile' | 'desktop') => ({
    title: {
      fontFamily: fontSettings.title.fontFamily,
      fontWeight: fontSettings.title.fontWeight,
      fontStyle: fontSettings.title.fontStyle,
      fontSize: fontSettings.title?.[view]?.fontSize || fontSettings.title.desktop.fontSize
    },
    description: {
      fontFamily: fontSettings.description.fontFamily,
      fontWeight: fontSettings.description.fontWeight,
      fontStyle: fontSettings.description.fontStyle,
      fontSize: fontSettings.description?.[view]?.fontSize || fontSettings.description.desktop.fontSize
    },
    price: {
      fontFamily: fontSettings.price.fontFamily,
      fontWeight: fontSettings.price.fontWeight,
      fontStyle: fontSettings.price.fontStyle,
      fontSize: fontSettings.price?.[view]?.fontSize || fontSettings.price.desktop.fontSize
    }
  });

  const getDetailFontSettings = () => ({
    title: {
      fontFamily: fontSettings.title.fontFamily,
      fontWeight: fontSettings.title.fontWeight,
      fontStyle: fontSettings.title.fontStyle,
      fontSize: fontSettings.title?.detail?.fontSize || fontSettings.title.desktop.fontSize
    },
    description: {
      fontFamily: fontSettings.description.fontFamily,
      fontWeight: fontSettings.description.fontWeight,
      fontStyle: fontSettings.description.fontStyle,
      fontSize: fontSettings.description?.detail?.fontSize || fontSettings.description.desktop.fontSize
    },
    price: {
      fontFamily: fontSettings.price.fontFamily,
      fontWeight: fontSettings.price.fontWeight,
      fontStyle: fontSettings.price.fontStyle,
      fontSize: fontSettings.price?.detail?.fontSize || fontSettings.price.desktop.fontSize
    }
  });

  return {
    getCardFontSettings,
    getDetailFontSettings
  };
};
