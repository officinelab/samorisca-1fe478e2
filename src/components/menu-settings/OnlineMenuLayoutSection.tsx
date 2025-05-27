import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Product } from "@/types/database";
import { toast } from "@/hooks/use-toast";
import { OnlineMenuLayoutSelector } from "./OnlineMenuLayoutSelector";
import { OnlineMenuFontSelectors } from "./OnlineMenuFontSelectors";
import { OnlineMenuLayoutPreview } from "./OnlineMenuLayoutPreview";
import { OnlineMenuProductDetailsPreview } from "./OnlineMenuProductDetailsPreview";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Esempio prodotto di test
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

// Aggiornato: Aggiungi "price"
const DEFAULT_FONT_SETTINGS = {
  title: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  description: {
    fontFamily: "Open Sans",
    fontWeight: "normal",
    fontStyle: "normal",
  },
  price: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
  },
};

// Stessa lista delle icone ammesse dallo user
const ICONS = [
  { label: "Bookmark Plus", value: "bookmark-plus" },
  { label: "Circle Plus", value: "circle-plus" },
  { label: "Plus", value: "plus" },
  { label: "Heart Plus", value: "heart-plus" },
  { label: "Badge Plus", value: "badge-plus" },
  { label: "Circle Check Big", value: "circle-check-big" },
];

// DEMO: visualizzazione icone
import {
  BookmarkPlus,
  CirclePlus,
  Plus,
  HeartPlus,
  BadgePlus,
  CircleCheckBig,
} from "lucide-react";

// Impostazioni di default per il pulsante
const DEFAULT_ADD_TO_CART_BTN = {
  addToCartButtonColor: "#7E69AB",
  addToCartButtonIcon: "plus",
};

export default function OnlineMenuLayoutSection() {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [selectedLayout, setSelectedLayout] = useState(siteSettings?.publicMenuLayoutType || "default");

  // Carica settings font per layout attuale
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const publicMenuButtonSettings = siteSettings?.publicMenuButtonSettings || {};

  // fallback: se manca uno dei tre, completa sempre con default
  const currFontSettings = {
    ...DEFAULT_FONT_SETTINGS,
    ...(publicMenuFontSettings?.[selectedLayout] || {}),
  };

  // Gestione stato font
  const [fontSettings, setFontSettings] = useState(currFontSettings);

  // Gestione stato button settings
  const [buttonSettings, setButtonSettings] = useState(() => ({
    ...DEFAULT_ADD_TO_CART_BTN,
    ...(publicMenuButtonSettings?.[selectedLayout] || {}),
  }));

  useEffect(() => {
    setSelectedLayout(siteSettings?.publicMenuLayoutType || "default");
    setFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(publicMenuFontSettings?.[siteSettings?.publicMenuLayoutType || "default"] || {}),
    });
    setButtonSettings({
      ...DEFAULT_ADD_TO_CART_BTN,
      ...(publicMenuButtonSettings?.[siteSettings?.publicMenuLayoutType || "default"] || {}),
    });
  }, [siteSettings?.publicMenuLayoutType, publicMenuFontSettings, publicMenuButtonSettings]);

  // Quando cambio il layout, salvo anche globalmente!
  const handleLayoutChange = async (newLayout: string) => {
    setSelectedLayout(newLayout);
    setFontSettings({
      ...DEFAULT_FONT_SETTINGS,
      ...(publicMenuFontSettings?.[newLayout] || {}),
    });
    setButtonSettings({
      ...DEFAULT_ADD_TO_CART_BTN,
      ...(publicMenuButtonSettings?.[newLayout] || {}),
    });
    await saveSetting("publicMenuLayoutType", newLayout);
    toast({
      title: "Layout applicato",
      description: `Hai selezionato il layout "${newLayout === "default" ? "Classico" : "Custom 1"}"`,
    });
  };

  // Salva SOLO su publicMenuFontSettings, anche per il font prezzo
  const handleFontChange = (key: "title" | "description" | "price", value: any) => {
    const newValue = { ...fontSettings, [key]: value };
    setFontSettings(newValue);
    // Salva nelle impostazioni SOLO per layout attivo nell'oggetto aggregato
    const nextPublicMenuFontSettings = {
      ...publicMenuFontSettings,
      [selectedLayout]: newValue,
    };
    saveSetting("publicMenuFontSettings", nextPublicMenuFontSettings);
    toast({ title: "Font aggiornato", description: `Font ${key} salvato per layout ${selectedLayout}` });
  };

  // Gestione cambio colore/button icon
  const handleButtonChange = (key: "addToCartButtonColor" | "addToCartButtonIcon", value: string) => {
    const newButtonSettings = { ...buttonSettings, [key]: value };
    setButtonSettings(newButtonSettings);
    const nextPublicMenuButtonSettings = {
      ...publicMenuButtonSettings,
      [selectedLayout]: newButtonSettings,
    };
    saveSetting("publicMenuButtonSettings", nextPublicMenuButtonSettings);
    let desc = key === "addToCartButtonColor"
      ? "Colore del pulsante salvato."
      : "Icona del pulsante salvata.";
    toast({ title: "Personalizzazione pulsante", description: desc });
  };

  // Icon preview rendering
  const renderIconPreview = (icon: string, size = 20, color = "#7E69AB") => {
    switch (icon) {
      case "bookmark-plus":
        return <BookmarkPlus size={size} color={color} />;
      case "circle-plus":
        return <CirclePlus size={size} color={color} />;
      case "plus":
        return <Plus size={size} color={color} />;
      case "heart-plus":
        return <HeartPlus size={size} color={color} />;
      case "badge-plus":
        return <BadgePlus size={size} color={color} />;
      case "circle-check-big":
        return <CircleCheckBig size={size} color={color} />;
      default:
        return <Plus size={size} color={color} />;
    }
  };

  return (
    <div className="max-w-4xl space-y-8 mx-auto">
      <h2 className="text-xl font-semibold">Layout menu online</h2>
      <p className="text-muted-foreground mb-2">
        Scegli come vengono mostrate le voci del menu pubblico e personalizza il font di titolo, descrizione e prezzo.
      </p>

      <OnlineMenuLayoutSelector
        selectedLayout={selectedLayout}
        onSelect={handleLayoutChange}
      />

      {/* ⬇️ Tre selettori: titolo, descrizione e prezzo */}
      <OnlineMenuFontSelectors fontSettings={fontSettings} onFontChange={handleFontChange} />

      {/* Personalizzazione pulsante */}
      <div className="flex gap-6 items-end mb-6">
        <div>
          <Label htmlFor="addToCartButtonColor" className="block mb-1">
            Colore di sfondo pulsante carrello
          </Label>
          <Input
            id="addToCartButtonColor"
            type="color"
            value={buttonSettings.addToCartButtonColor}
            onChange={e => handleButtonChange("addToCartButtonColor", e.target.value)}
            className="w-12 h-10 p-0 border-none bg-transparent"
          />
        </div>
        <div>
          <Label htmlFor="addToCartButtonIcon" className="block mb-1">
            Icona pulsante aggiungi
          </Label>
          <Select
            value={buttonSettings.addToCartButtonIcon}
            onValueChange={v => handleButtonChange("addToCartButtonIcon", v)}
          >
            <SelectTrigger className="w-44 h-10">
              <SelectValue placeholder="Scegli icona" />
            </SelectTrigger>
            <SelectContent>
              {ICONS.map(icon => (
                <SelectItem key={icon.value} value={icon.value} className="flex items-center gap-2">
                  <span className="flex items-center mr-2">
                    {renderIconPreview(icon.value, 20, buttonSettings.addToCartButtonColor)}
                  </span>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center ml-2">
          <span className="text-xs mb-1">Anteprima</span>
          <span style={{ background: buttonSettings.addToCartButtonColor, padding: 8, borderRadius: 30, display: "inline-flex", color: "#fff" }}>
            {renderIconPreview(buttonSettings.addToCartButtonIcon, 24, "#fff")}
          </span>
        </div>
      </div>

      {/* Passa fontSettings E buttonSettings ai preview */}
      <OnlineMenuLayoutPreview
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
        truncateText={truncateText}
      />
      <OnlineMenuProductDetailsPreview
        selectedLayout={selectedLayout}
        fontSettings={fontSettings}
        buttonSettings={buttonSettings}
        exampleProduct={exampleProduct}
      />
    </div>
  );
}
