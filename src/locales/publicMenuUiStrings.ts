export type PublicMenuUiLang = 'it' | 'en' | 'es' | 'fr';

export type PublicMenuUiStringKey =
  | "service_and_cover"
  | "show_allergens_info"
  | "hide_allergens_info"
  | "allergens_legend"
  | "info_products"
  | "description"
  | "allergens"
  | "price"
  | "add"
  | "add_to_cart"
  | "your_order"
  | "review_order"
  | "empty_order"
  | "total"
  | "cancel"
  | "confirm";
  | "product_features";


const uiStrings: Record<PublicMenuUiLang, Record<PublicMenuUiStringKey, string>> = {
  it: {
    service_and_cover: "Servizio e coperto",
    show_allergens_info: "Mostra informazioni allergeni",
    hide_allergens_info: "Nascondi informazioni allergeni",
    allergens_legend: "Legenda allergeni",
    info_products: "Info prodotti",
    description: "Descrizione",
    allergens: "Allergeni",
    price: "Prezzo",
    add: "Aggiungi",
    add_to_cart: "Aggiungi all'ordine",
    your_order: "Il tuo ordine",
    review_order: "Rivedi il tuo ordine prima di comunicarlo al cameriere.",
    empty_order: "Il tuo ordine è vuoto",
    total: "Totale",
    cancel: "Annulla",
    confirm: "Conferma",
    product_features: "Caratteristiche dei prodotti",
  },
  en: {
    service_and_cover: "Service and cover",
    show_allergens_info: "Show allergen information",
    hide_allergens_info: "Hide allergen information",
    allergens_legend: "Allergens legend",
    info_products: "Product info",
    description: "Description",
    allergens: "Allergens",
    price: "Price",
    add: "Add",
    add_to_cart: "Add to order",
    your_order: "Your order",
    review_order: "Review your order before submitting it to the waiter.",
    empty_order: "Your order is empty",
    total: "Total",
    cancel: "Cancel",
    confirm: "Confirm",
    product_features: "Product features",
  },
  es: {
    service_and_cover: "Servicio y cubierto",
    show_allergens_info: "Mostrar información de alérgenos",
    hide_allergens_info: "Ocultar información de alérgenos",
    allergens_legend: "Leyenda de alérgenos",
    info_products: "Información del producto",
    description: "Descripción",
    allergens: "Alérgenos",
    price: "Precio",
    add: "Añadir",
    add_to_cart: "Añadir al pedido",
    your_order: "Tu pedido",
    review_order: "Revisa tu pedido antes de comunicárselo al camarero.",
    empty_order: "Tu pedido está vacío",
    total: "Total",
    cancel: "Cancelar",
    confirm: "Confirmar",
    product_features: "Características del producto",
  },
  fr: {
    service_and_cover: "Service et couvert",
    show_allergens_info: "Afficher les informations sur les allergènes",
    hide_allergens_info: "Masquer les informations sur les allergènes",
    allergens_legend: "Légende des allergènes",
    info_products: "Infos produit",
    description: "Description",
    allergens: "Allergènes",
    price: "Prix",
    add: "Ajouter",
    add_to_cart: "Ajouter à la commande",
    your_order: "Votre commande",
    review_order: "Vérifiez votre commande avant de la remettre au serveur.",
    empty_order: "Votre commande est vide",
    total: "Total",
    cancel: "Annuler",
    confirm: "Confirmer",
    product_features: "Caractéristiques du produit",
  },
};

export default uiStrings;
