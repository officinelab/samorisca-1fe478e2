import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { ProductCardWrapper } from "@/components/public-menu/product-card/ProductCardWrapper";
import { toast } from "@/hooks/use-toast";
import { ProductDetailsDialog } from "@/components/public-menu/ProductDetailsDialog";
import { ProductDetailsDialogPreview } from "@/components/public-menu/ProductDetailsDialogPreview";
import { FontSelector } from "./font-settings/FontSelector";
import { Bold, Italic } from "lucide-react";

// Utility per i Google Fonts predefiniti
export const DEFAULT_FONTS = [
  { name: "Inter", css: "Inter, sans-serif" },
  { name: "Roboto", css: "Roboto, sans-serif" },
  { name: "Lato", css: "Lato, sans-serif" },
  { name: "Montserrat", css: "Montserrat, sans-serif" },
  { name: "Playfair Display", css: "'Playfair Display', serif" },
  { name: "Merriweather", css: "Merriweather, serif" }
];

// Carica dinamicamente il font Google se serve
function loadGoogleFont(fontName: string) {
  const loaded = document.querySelector(`link[data-font='${fontName}']`);
  if (loaded) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    / /g,
    "+"
  )}:wght@400;700;900&display=swap`;
  link.setAttribute("data-font", fontName);
  document.head.appendChild(link);
}

// Esempio prodotto di test con allergeni, etichetta, caratteristiche
const exampleProduct: Product = {
  id: "demo-id",
  category_id: "demo-category-id",
  is_active: true,
  display_order: 1,
  title: "Pizza Margherita",
  displayTitle: "Pizza Margherita",
  description: "Pomodoro, mozzarella fiordilatte, basilico, olio extravergine.",
  displayDescription: "Pomodoro, mozzarella fiordilatte, basilico, olio EVO.",
  image_url: "/placeholder.svg",
  price_standard: 8.5,
  has_multiple_prices: false,
  has_price_suffix: false,
  price_suffix: "",
  label: {
    id: "label-demo",
    title: "NUOVO",
    displayTitle: "NUOVO",
    color: "#0ea5e9",
    text_color: "#fff",
    display_order: 1,
    created_at: "",
    updated_at: ""
  },
  allergens: [
    {
      id: "allergen-1",
      number: 1,
      title: "Glutine",
      displayTitle: "Glutine",
      description: null,
      icon_url: "/placeholder.svg",
      display_order: 1
    },
    {
      id: "allergen-7",
      number: 7,
      title: "Latte",
      displayTitle: "Latte e derivati",
      description: null,
      icon_url: "/placeholder.svg",
      display_order: 2
    }
  ],
  features: [
    {
      id: "feature-1",
      title: "Vegetariano",
      displayTitle: "Vegetariano",
      icon_url: "/placeholder.svg",
      display_order: 1
    },
    {
      id: "feature-2",
      title: "Specialità chef",
      displayTitle: "Specialità chef",
      icon_url: "/placeholder.svg",
      display_order: 2
    }
  ],
};

function truncateText(text: string | null = "", maxLength: number = 120) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

const layoutLabel: Record<string, string> = {
  default: "Classico",
  custom1: "Custom 1"
};

const PREVIEW_SCALE_DESKTOP = 0.90;
const PREVIEW_SCALE_MOBILE = 0.90;

// Chiave delle impostazioni font per ciascun layout
const FONT_SETTINGS_KEY = (layout: string) => `publicMenuFont__${layout}`;

// Tipo esplicito per le impostazioni font
type LayoutFontSettings = {
  titleFont: string;
  titleBold: boolean;
  titleItalic: boolean;
  descriptionFont: string;
  descriptionBold: boolean;
  descriptionItalic: boolean;
};

// Funzione di utilità che restituisce il CSS style per titolo/descrizione in base alle impostazioni scelte
function getPreviewFontStyles(layoutFontSettings: LayoutFontSettings) {
  return {
    title: {
      fontFamily: layoutFontSettings.titleFont,
      fontWeight: layoutFontSettings.titleBold ? "bold" : "normal",
      fontStyle: layoutFontSettings.titleItalic ? "italic" : "normal",
      fontSize: 22,
      lineHeight: 1.13
    },
    description: {
      fontFamily: layoutFontSettings.descriptionFont,
      fontWeight: layoutFontSettings.descriptionBold ? "bold" : "normal",
      fontStyle: layoutFontSettings.descriptionItalic ? "italic" : "normal"
    }
  };
}

// Funzione che restituisce gli stili del font titolo/descrizione ma permette di forzarne la size
function getPreviewFontStylesWithSize(layoutFontSettings: LayoutFontSettings, forcedTitleFontSize?: number) {
  return {
    title: {
      fontFamily: layoutFontSettings.titleFont,
      fontWeight: layoutFontSettings.titleBold ? "bold" : "normal",
      fontStyle: layoutFontSettings.titleItalic ? "italic" : "normal",
      fontSize: forcedTitleFontSize ? forcedTitleFontSize : 22, // default desktop
      lineHeight: 1.13,
    },
    description: {
      fontFamily: layoutFontSettings.descriptionFont,
      fontWeight: layoutFontSettings.descriptionBold ? "bold" : "normal",
      fontStyle: layoutFontSettings.descriptionItalic ? "italic" : "normal"
    }
  };
}

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting } = useSiteSettings();
  // State per layout selezionato
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  // State AGGIUNTO per nome custom font inserito dall’utente
  const [customFontName, setCustomFontName] = useState("");

  // Dobbiamo leggere ogni volta la font settings della chiave giusta
  const FONT_SETTINGS_KEY = (layout: string) => `publicMenuFont__${layout}`;
  // Salviamo lo stato font settings separato per ogni layout
  const [layoutFontSettings, setLayoutFontSettings] = useState<LayoutFontSettings>(() => {
    // Al primo render, cerca la key specifica per il layout selezionato
    const key = FONT_SETTINGS_KEY(siteSettings?.publicMenuLayoutType || "default");
    const layoutFonts = siteSettings?.[key];
    if (layoutFonts) return layoutFonts;
    return {
      titleFont: DEFAULT_FONTS[0].css,
      titleBold: false,
      titleItalic: false,
      descriptionFont: DEFAULT_FONTS[0].css,
      descriptionBold: false,
      descriptionItalic: false
    }
  });

  // Quando cambia layout o impostazioni, aggiorna font settings solo per la chiave giusta
  useEffect(() => {
    const key = FONT_SETTINGS_KEY(selectedLayout);
    const layoutFonts = siteSettings?.[key];
    if (layoutFonts) {
      setLayoutFontSettings(layoutFonts);
      // Precarica i font giusti
      loadGoogleFont(layoutFonts.titleFont.replace(/['",]/g, "").split(",")[0].trim());
      loadGoogleFont(layoutFonts.descriptionFont.replace(/['",]/g, "").split(",")[0].trim());
    } else {
      setLayoutFontSettings({
        titleFont: DEFAULT_FONTS[0].css,
        titleBold: false,
        titleItalic: false,
        descriptionFont: DEFAULT_FONTS[0].css,
        descriptionBold: false,
        descriptionItalic: false
      });
    }
  }, [siteSettings, selectedLayout]);

  // Carica ogni volta che si cambia font impostato (ci serve per extra fonts autoinstall)
  useEffect(() => {
    if (layoutFontSettings.titleFont) {
      const fontName = layoutFontSettings.titleFont.replace(/['",]/g, "").split(",")[0].trim();
      loadGoogleFont(fontName);
    }
    if (layoutFontSettings.descriptionFont) {
      const fontName = layoutFontSettings.descriptionFont.replace(/['",]/g, "").split(",")[0].trim();
      loadGoogleFont(fontName);
    }
  }, [layoutFontSettings.titleFont, layoutFontSettings.descriptionFont]);

  // LOGICA: Precarica il custom font se digitato/usato
  useEffect(() => {
    if (customFontName) {
      loadGoogleFont(customFontName);
    }
  }, [customFontName]);

  // Gestore cambio layout: salva anche su impostazioni globali la key selezionata
  const handleSelect = (layout: string) => {
    setSelectedLayout(layout);
    // Salva la scelta dell'utente
    saveSetting("publicMenuLayoutType", layout);
    // Mostra toast
    toast({
      title: "Layout aggiornato",
      description: layoutLabel[layout] || layout,
    });
    // Forza ricarica delle impostazioni font di quel layout (letto sopra nell'useEffect)
  };

  // Salva solo le font options della chiave attualmente attiva!
  const handleFontChange = (partial: Partial<typeof layoutFontSettings>) => {
    const updated = { ...layoutFontSettings, ...partial };
    setLayoutFontSettings(updated);
    saveSetting(FONT_SETTINGS_KEY(selectedLayout), updated); // salva sulla chiave specifica
    toast({
      title: "Font aggiornati",
      description: "Anteprima aggiornata per il layout " + layoutLabel[selectedLayout],
    });
  };

  // Funzioni per ritornare fontStyles hardcoded per preview (Classico), come da richieste
  function getClassicoPreviewFontStyles(partial?: Partial<LayoutFontSettings>, forcedTitleFontSize?: number) {
    return {
      title: {
        fontFamily: partial?.titleFont || layoutFontSettings.titleFont,
        fontWeight: partial?.titleBold ? "bold" : layoutFontSettings.titleBold ? "bold" : "normal",
        fontStyle: partial?.titleItalic ? "italic" : layoutFontSettings.titleItalic ? "italic" : "normal",
        // Classico: desktop 22, mobile 18, dettagli 20 (forzato da argomento)
        fontSize: forcedTitleFontSize ?? 22,
        lineHeight: 1.13
      },
      description: {
        fontFamily: partial?.descriptionFont || layoutFontSettings.descriptionFont,
        fontWeight: partial?.descriptionBold ? "bold" : layoutFontSettings.descriptionBold ? "bold" : "normal",
        fontStyle: partial?.descriptionItalic ? "italic" : layoutFontSettings.descriptionItalic ? "italic" : "normal"
      }
    }
  }

  // Per il custom1 lasciamo le stesse taglie attuali (desktop 22, mobile 18, dettagli 20)
  function getCustom1PreviewFontStyles(partial?: Partial<LayoutFontSettings>, forcedTitleFontSize?: number) {
    return {
      title: {
        fontFamily: partial?.titleFont || layoutFontSettings.titleFont,
        fontWeight: partial?.titleBold ? "bold" : layoutFontSettings.titleBold ? "bold" : "normal",
        fontStyle: partial?.titleItalic ? "italic" : layoutFontSettings.titleItalic ? "italic" : "normal",
        fontSize: forcedTitleFontSize ?? 22,
        lineHeight: 1.13
      },
      description: {
        fontFamily: partial?.descriptionFont || layoutFontSettings.descriptionFont,
        fontWeight: partial?.descriptionBold ? "bold" : layoutFontSettings.descriptionBold ? "bold" : "normal",
        fontStyle: partial?.descriptionItalic ? "italic" : layoutFontSettings.descriptionItalic ? "italic" : "normal"
      }
    }
  }

  // Scegli una previewFontStyles basata sul layout selezionato
  const getPreviewFontStylesForLayout = (forcedTitleFontSize?: number) =>
    selectedLayout === "custom1"
      ? getCustom1PreviewFontStyles(undefined, forcedTitleFontSize)
      : getClassicoPreviewFontStyles(undefined, forcedTitleFontSize);

  // Creazione combinazione di stili css per i preview
  const getTitleStyle = () => ({
    fontFamily: layoutFontSettings.titleFont,
    fontWeight: layoutFontSettings.titleBold ? "bold" : "normal",
    fontStyle: layoutFontSettings.titleItalic ? "italic" : "normal",
    fontSize: 22,
    lineHeight: 1.13
  });
  const getDescStyle = () => ({
    fontFamily: layoutFontSettings.descriptionFont,
    fontWeight: layoutFontSettings.descriptionBold ? "bold" : "normal",
    fontStyle: layoutFontSettings.descriptionItalic ? "italic" : "normal"
  });

  // Funzione per aggiungere font custom
  const handleAddGoogleFont = () => {
    if (!customFontName) return;
    loadGoogleFont(customFontName);
    setCustomFontName("");
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico.
      </p>
      {/* Pulsanti selezione layout */}
      <div className="flex gap-3 justify-center mb-5">
        <Button
          size="sm"
          variant={selectedLayout === "default" ? "default" : "outline"}
          className="mx-auto"
          onClick={() => handleSelect("default")}
        >
          Classico
        </Button>
        <Button
          size="sm"
          variant={selectedLayout === "custom1" ? "default" : "outline"}
          className="mx-auto"
          onClick={() => handleSelect("custom1")}
        >
          Custom 1
        </Button>
      </div>

      {/* Sezione selezione font */}
      <Card className="p-4 mt-2">
        <h3 className="font-semibold mb-3 text-lg">Impostazioni Font per questo layout</h3>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Titolo */}
          <div className="flex-1">
            <Label>Titolo prodotto</Label>
            <div className="mt-2 flex gap-2 items-center">
              <FontSelector
                value={layoutFontSettings.titleFont}
                onChange={val => handleFontChange({ titleFont: val })}
                extraFonts={customFontName ? [customFontName] : []}
              />
              {/* Stili */}
              <Button
                size="icon"
                variant={layoutFontSettings.titleBold ? "default" : "outline"}
                className="ml-2"
                aria-label="Attiva/disattiva grassetto titolo"
                onClick={() =>
                  handleFontChange({ titleBold: !layoutFontSettings.titleBold })
                }
              >
                <Bold size={18} />
              </Button>
              <Button
                size="icon"
                variant={layoutFontSettings.titleItalic ? "default" : "outline"}
                aria-label="Attiva/disattiva corsivo titolo"
                onClick={() =>
                  handleFontChange({ titleItalic: !layoutFontSettings.titleItalic })
                }
              >
                <Italic size={18} />
              </Button>
            </div>
            <div
              style={getTitleStyle()}
              className="mt-2 border rounded p-2 bg-muted"
            >
              {exampleProduct.title}
            </div>
          </div>
          {/* Descrizione */}
          <div className="flex-1">
            <Label>Descrizione prodotto</Label>
            <div className="mt-2 flex gap-2 items-center">
              <FontSelector
                value={layoutFontSettings.descriptionFont}
                onChange={val => handleFontChange({ descriptionFont: val })}
                extraFonts={customFontName ? [customFontName] : []}
              />
              {/* Stili */}
              <Button
                size="icon"
                variant={layoutFontSettings.descriptionBold ? "default" : "outline"}
                className="ml-2"
                aria-label="Attiva/disattiva grassetto descrizione"
                onClick={() =>
                  handleFontChange({ descriptionBold: !layoutFontSettings.descriptionBold })
                }
              >
                <Bold size={18} />
              </Button>
              <Button
                size="icon"
                variant={layoutFontSettings.descriptionItalic ? "default" : "outline"}
                aria-label="Attiva/disattiva corsivo descrizione"
                onClick={() =>
                  handleFontChange({ descriptionItalic: !layoutFontSettings.descriptionItalic })
                }
              >
                <Italic size={18} />
              </Button>
            </div>
            <div
              style={getDescStyle()}
              className="mt-2 border rounded p-2 bg-muted"
            >
              {exampleProduct.description}
            </div>
          </div>
        </div>
        {/* Aggiungi nuovo font Google */}
        <div className="mt-4">
          <Label className="mb-2 block">Aggiungi un nuovo Google Font</Label>
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 rounded min-w-[180px]"
              placeholder="Nome esatto font (es. Nunito)"
              value={customFontName}
              onChange={e => setCustomFontName(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={handleAddGoogleFont}
              type="button"
              disabled={!customFontName}
            >
              Installa Font
            </Button>
          </div>
          <small className="text-muted-foreground block mt-1">
            Inserisci il nome esatto di un font presente su Google Fonts.<br />
            Es: <span className="font-mono text-xs">Nunito</span>, <span className="font-mono text-xs">Bebas Neue</span>, ecc.
          </small>
        </div>
      </Card>

      {/* Anteprime: Desktop + Mobile */}
      <div className="flex gap-8 flex-wrap justify-center items-start">
        {/* Desktop Preview, scalata */}
        <div className="flex flex-col items-center" style={{ width: 460 }}>
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE_DESKTOP})`,
              transformOrigin: "top center",
              width: 520,
              minWidth: 350,
            }}
            className="rounded-md"
          >
            <div className="max-w-2xl w-full min-w-[350px] border rounded-md shadow bg-white p-3 mx-auto">
              <span className="block text-center text-xs text-muted-foreground mb-1">Anteprima desktop</span>
              <ProductCardWrapper
                product={exampleProduct}
                onProductSelect={() => {}}
                addToCart={() => {}}
                truncateText={truncateText}
                deviceView="desktop"
                layoutType={selectedLayout}
                // desktop: 22px classico/custom1
                previewFontStyles={getPreviewFontStylesForLayout(22)}
              />
              <Label className="block text-center mt-2">{layoutLabel[selectedLayout]}</Label>
              <Button
                size="sm"
                variant="outline"
                className="mx-auto block mt-2"
                disabled
              >
                {selectedLayout === "default" ? "Selezionando 'Classico'" : "Selezionando 'Custom 1'"}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Preview, scalata proporzionalmente */}
        <div className="flex flex-col items-center" style={{ width: 376 }}>
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE_MOBILE})`,
              transformOrigin: "top center",
              width: 375,
              minWidth: 310,
            }}
            className="rounded-md"
          >
            <div className="max-w-md w-full border rounded-md shadow bg-white p-3 mx-auto">
              <span className="block text-center text-xs text-muted-foreground mb-1">Anteprima mobile</span>
              <ProductCardWrapper
                product={exampleProduct}
                onProductSelect={() => {}}
                addToCart={() => {}}
                truncateText={truncateText}
                deviceView="mobile"
                layoutType={selectedLayout}
                // mobile: 18px classico/custom1
                previewFontStyles={getPreviewFontStylesForLayout(18)}
              />
              <Label className="block text-center mt-2">{layoutLabel[selectedLayout]}</Label>
            </div>
          </div>
        </div>
      </div>
      {/* Anteprima Finestra dettagli prodotto (scalata, statica in frame) */}
      <div className="flex justify-center mt-8">
        <div
          style={{
            transform: `scale(${PREVIEW_SCALE_DESKTOP})`,
            transformOrigin: "top center",
            width: 400,
            minWidth: 300,
            maxWidth: 440,
            pointerEvents: "none",
            opacity: 0.98
          }}
        >
          <div className="shadow-lg rounded-lg border bg-white relative">
            <span className="block text-center text-xs text-muted-foreground pt-2">
              Anteprima finestra dettagli prodotto
            </span>
            <ProductDetailsDialogPreview
              product={exampleProduct}
              hideImage={selectedLayout === "custom1"}
              language="it"
              // dettagli prodotti: 20px classico/custom1
              previewFontStyles={getPreviewFontStylesForLayout(20)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
