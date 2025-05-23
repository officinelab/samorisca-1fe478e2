
export const dashboardStyles = {
  // Main layout - Migliorato con proporzioni più equilibrate
  container: "h-[calc(100vh-4rem)] bg-gray-50/50",
  desktopGrid: "grid grid-cols-12 h-full divide-x divide-gray-200",
  categoriesColumn: "col-span-3 h-full bg-white border-r border-gray-200", 
  productsColumn: "col-span-4 h-full bg-white border-r border-gray-200", 
  detailColumn: "col-span-5 h-full bg-white",

  // Categories list - Design moderno con cards
  categoriesHeader: "flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10",
  categoriesTitle: "text-xl font-semibold text-gray-900",
  categoryItem: "group flex flex-col p-4 m-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out border border-gray-100 hover:border-primary-200 hover:shadow-md",
  categoryItemSelected: "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-300 shadow-md",
  categoryItemHover: "hover:bg-gray-50 hover:shadow-sm",
  categoryItemInactive: "opacity-60 bg-gray-50",
  categoryContent: "flex items-center justify-between",
  categoryActions: "flex justify-end mt-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
  categoryReorderActions: "flex gap-1",
  categoryInactiveLabel: "text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600 font-medium",
  categoryTitle: "font-medium text-gray-900 text-base",
  categoryDescription: "text-sm text-gray-500 mt-1 line-clamp-2",

  // Products list - Cards migliorate
  productsHeader: "flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10",
  productsTitle: "text-xl font-semibold text-gray-900",
  productItem: "group border border-gray-100 rounded-xl p-4 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:border-primary-200 m-2",
  productItemSelected: "border-primary-300 bg-gradient-to-r from-primary-50 to-primary-100 shadow-md",
  productItemHover: "hover:bg-gray-50",
  productItemInactive: "opacity-60 bg-gray-50",
  productContent: "flex gap-4",
  productImage: "w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200",
  productImagePlaceholder: "w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0",
  productDetails: "flex-1 min-w-0",
  productTitle: "font-semibold text-gray-900 text-base mb-1",
  productDescription: "text-sm text-gray-600 line-clamp-2 mb-2",
  productPrice: "text-lg font-bold text-primary-600",
  productPriceSuffix: "text-sm text-gray-500 font-normal",
  productUnavailable: "text-xs bg-error-100 text-error-700 px-2 py-1 rounded-full font-medium",
  productLabel: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2",
  productMeta: "flex items-center gap-3 mt-2",
  productAllergens: "flex gap-1",
  productAllergenTag: "text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded-full font-medium",
  productActions: "flex justify-end mt-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
  productReorderActions: "flex gap-1",

  // Product detail - Layout migliorato
  detailHeader: "flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10",
  detailTitle: "text-xl font-semibold text-gray-900",
  detailContent: "p-6 space-y-8 overflow-y-auto",
  detailMainSection: "flex gap-6",
  detailImage: "w-48 h-48 rounded-xl overflow-hidden shadow-md",
  detailImagePlaceholder: "w-48 h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-md",
  detailProductInfo: "flex-1",
  detailProductTitle: "text-3xl font-bold text-gray-900 mb-2",
  detailProductLabel: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3",
  detailProductDescription: "text-gray-700 text-lg leading-relaxed mb-4",
  detailCategoryInfo: "mt-6 p-4 bg-gray-50 rounded-lg",
  detailCategoryLabel: "text-gray-600 font-medium text-sm",
  detailCategoryValue: "text-gray-900 font-semibold",
  detailUnavailableStatus: "bg-error-100 text-error-700 px-4 py-2 rounded-full text-sm font-medium",

  // Cards e sezioni
  card: "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200",
  cardHeader: "p-6 border-b border-gray-100",
  cardContent: "p-6",
  cardTitle: "text-xl font-semibold text-gray-900 mb-2",
  cardDescription: "text-gray-600",

  // Form components migliorati
  formContainer: "space-y-8",
  formSection: "space-y-6",
  formSectionTitle: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",
  formActions: "flex justify-end gap-4 pt-8 border-t border-gray-200",
  imageUploader: "space-y-4",
  imagePreview: "relative w-full h-48 mb-4 rounded-xl overflow-hidden",
  imageUploadButton: "cursor-pointer border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 w-full text-center hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200",
  
  // Features e allergens - Design a grid
  featuresContainer: "space-y-4",
  featuresGrid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
  featureTag: "flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200",
  featureTagSelected: "bg-primary-100 border-primary-300 text-primary-700 shadow-sm",
  featureTagUnselected: "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50",
  
  // Loading states migliorati
  skeletonItem: "h-16 w-full rounded-lg bg-gray-200 animate-pulse",
  skeletonProduct: "h-24 w-full rounded-lg bg-gray-200 animate-pulse", 
  loadingSpinner: "flex flex-col items-center justify-center space-y-4 py-12",
  loadingText: "text-gray-600 font-medium",

  // Empty states con illustrazioni
  emptyState: "text-center py-16 px-6",
  emptyStateIcon: "mx-auto w-24 h-24 text-gray-300 mb-6",
  emptyStateTitle: "text-xl font-semibold text-gray-900 mb-2",
  emptyStateDescription: "text-gray-600 mb-6 max-w-md mx-auto",
  emptyStateAction: "inline-flex items-center gap-2",
  
  // Mobile navigation migliorata
  mobileBackButton: "mr-3 p-2 rounded-lg hover:bg-gray-100",
  mobileHeader: "flex items-center px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10",
  mobileTitle: "text-lg font-semibold text-gray-900",
  
  // Common button variants
  buttonPrimary: "bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200",
  buttonSecondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg px-4 py-2 transition-colors duration-200",
  buttonDanger: "bg-error-600 hover:bg-error-700 text-white font-medium rounded-lg px-4 py-2 transition-colors duration-200",
  buttonSm: "h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-200",
  
  // Tables migliorati
  tableContainer: "space-y-6",
  priceInfo: "text-2xl font-bold text-primary-600",
  priceVariants: "grid gap-3 mt-4",
  priceVariant: "flex justify-between items-center p-3 bg-gray-50 rounded-lg",
  priceVariantValue: "text-gray-700 font-medium",

  // Multiple prices section
  multiplePricesContainer: "border border-gray-200 rounded-xl p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50",
  multiplePricesTitle: "font-semibold text-gray-900 text-lg flex items-center gap-2",
  multiplePricesGrid: "grid grid-cols-1 md:grid-cols-2 gap-4",

  // Features display migliorato
  featuresDisplay: "bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg px-3 py-2 flex items-center gap-2 font-medium text-blue-800",
  featureIcon: "w-5 h-5",

  // Allergens display migliorato  
  allergensDisplay: "bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg px-3 py-2 font-medium text-amber-800",

  // Search e filtri
  searchContainer: "relative flex-1 max-w-md",
  searchInput: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
  searchIcon: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",

  // Status indicators
  statusActive: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800",
  statusInactive: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800",

  // Animations
  fadeIn: "animate-[fadeIn_0.3s_ease-out]",
  slideUp: "animate-[slideUp_0.3s_ease-out]", 
  cardHover: "transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
};
