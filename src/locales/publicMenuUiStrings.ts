
export type PublicMenuUiLang = 'it' | 'en' | 'es' | 'fr' | 'de';

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
  | "confirm"
  | "product_features"
  | "item_added_to_cart"
  | "order_cancelled"
  | "order_ready_show_waiter"
  | "loading_taking_long"
  | "menu_loaded_in_seconds"
  | "error_loading_menu"
  | "error_loading_retry"
  | "loading"
  | "no_elements_found"
  | "retry";

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
    item_added_to_cart: "aggiunto all'ordine",
    order_cancelled: "Ordine annullato",
    order_ready_show_waiter: "Ordine pronto! Mostralo al cameriere.",
    loading_taking_long: "Il caricamento sta richiedendo più tempo del solito...",
    menu_loaded_in_seconds: "Menu caricato in",
    error_loading_menu: "Errore nel caricamento del menu. Riprova più tardi.",
    error_loading_retry: "Riprova",
    loading: "Caricamento in corso...",
    no_elements_found: "Nessun elemento trovato",
    retry: "Riprova"
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
    item_added_to_cart: "added to order",
    order_cancelled: "Order cancelled",
    order_ready_show_waiter: "Order ready! Show it to the waiter.",
    loading_taking_long: "Loading is taking longer than usual...",
    menu_loaded_in_seconds: "Menu loaded in",
    error_loading_menu: "Error loading menu. Please try again later.",
    error_loading_retry: "Try again",
    loading: "Loading...",
    no_elements_found: "No items found",
    retry: "Retry"
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
    item_added_to_cart: "añadido al pedido",
    order_cancelled: "Pedido cancelado",
    order_ready_show_waiter: "¡Pedido listo! Muéstraselo al camarero.",
    loading_taking_long: "La carga está tardando más de lo habitual...",
    menu_loaded_in_seconds: "Menú cargado en",
    error_loading_menu: "Error al cargar el menú. Inténtalo de nuevo más tarde.",
    error_loading_retry: "Intentar de nuevo",
    loading: "Cargando...",
    no_elements_found: "No se encontraron elementos",
    retry: "Reintentar"
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
    item_added_to_cart: "ajouté à la commande",
    order_cancelled: "Commande annulée",
    order_ready_show_waiter: "Commande prête ! Montrez-la au serveur.",
    loading_taking_long: "Le chargement prend plus de temps que d'habitude...",
    menu_loaded_in_seconds: "Menu chargé en",
    error_loading_menu: "Erreur lors du chargement du menu. Veuillez réessayer plus tard.",
    error_loading_retry: "Réessayer",
    loading: "Chargement en cours...",
    no_elements_found: "Aucun élément trouvé",
    retry: "Réessayer"
  },
  de: {
    service_and_cover: "Service und Gedeck",
    show_allergens_info: "Allergeninformationen anzeigen",
    hide_allergens_info: "Allergeninformationen ausblenden",
    allergens_legend: "Allergen-Legende",
    info_products: "Produktinformationen",
    description: "Beschreibung",
    allergens: "Allergene",
    price: "Preis",
    add: "Hinzufügen",
    add_to_cart: "Zur Bestellung hinzufügen",
    your_order: "Ihre Bestellung",
    review_order: "Überprüfen Sie Ihre Bestellung, bevor Sie sie dem Kellner mitteilen.",
    empty_order: "Ihre Bestellung ist leer",
    total: "Gesamt",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    product_features: "Produkteigenschaften",
    item_added_to_cart: "zur Bestellung hinzugefügt",
    order_cancelled: "Bestellung storniert",
    order_ready_show_waiter: "Bestellung bereit! Zeigen Sie sie dem Kellner.",
    loading_taking_long: "Das Laden dauert länger als gewöhnlich...",
    menu_loaded_in_seconds: "Menü geladen in",
    error_loading_menu: "Fehler beim Laden des Menüs. Bitte versuchen Sie es später erneut.",
    error_loading_retry: "Erneut versuchen",
    loading: "Wird geladen...",
    no_elements_found: "Keine Elemente gefunden",
    retry: "Wiederholen"
  }
};

export default uiStrings;
