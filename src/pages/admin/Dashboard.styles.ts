
export const dashboardStyles = {
  // Main layout
  container: "h-[calc(100vh-4rem)]",
  desktopGrid: "grid grid-cols-12 h-full divide-x",
  categoriesColumn: "col-span-2 h-full border-r",
  productsColumn: "col-span-5 h-full border-r", 
  detailColumn: "col-span-5 h-full",

  // Mobile optimizations
  mobileContainer: "h-[calc(100vh-4rem)] flex flex-col bg-gray-50",
  mobileHeader: "flex-shrink-0 p-3 bg-white sticky top-0 z-10 shadow-sm border-b",
  mobileContent: "flex-1 overflow-y-auto -webkit-overflow-scrolling-touch",
  mobileBackButton: "mr-3 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center",
  mobileTitle: "text-lg font-semibold truncate flex-1",
  mobileHeaderContent: "flex items-center w-full",

  // Categories list
  categoriesHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 shadow-sm",
  categoriesTitle: "text-lg font-semibold",
  categoriesContent: "p-4 space-y-3",
  categoryItem: "flex flex-col p-4 rounded-lg cursor-pointer touch-manipulation min-h-[72px] bg-white shadow-sm border transition-all duration-200 active:scale-[0.98]",
  // Fixed: Better contrast for selected category in mobile - dark blue background with white text
  categoryItemSelected: "bg-blue-600 text-white shadow-lg border-blue-600",
  categoryItemHover: "hover:shadow-md hover:bg-gray-50 active:bg-gray-100",
  categoryItemInactive: "opacity-60",
  categoryContent: "flex items-center justify-between mb-2",
  categoryTitle: "font-medium text-base leading-5",
  categoryActions: "flex justify-end mt-3 gap-2",
  categoryReorderActions: "flex mr-2 gap-1",
  categoryInactiveLabel: "text-sm px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium",

  // Products list  
  productsHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 shadow-sm",
  productsContent: "p-4 space-y-4",
  productItem: "bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 touch-manipulation min-h-[100px] shadow-sm active:scale-[0.98]",
  // Fixed: Better contrast for selected product in mobile - dark blue background with white text
  productItemSelected: "border-blue-600 bg-blue-600 text-white shadow-lg",
  productItemHover: "hover:shadow-md hover:bg-gray-50 active:bg-gray-100",
  productItemInactive: "opacity-60",
  productContent: "flex space-x-4",
  productImage: "w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100",
  productImagePlaceholder: "w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0",
  productDetails: "flex-1 min-w-0 space-y-2",
  productTitle: "font-semibold text-base leading-5 text-gray-900",
  productDescription: "text-sm text-gray-600 line-clamp-2 leading-4",
  productPrice: "text-base font-bold text-gray-900",
  productPriceSuffix: "text-sm text-gray-500 font-normal",
  productUnavailable: "text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md font-medium",
  productAllergens: "flex space-x-1 flex-wrap mt-1",
  productAllergenTag: "text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium",
  productActions: "flex justify-end mt-3 gap-2",
  productReorderActions: "flex mr-2 gap-1",
  productMetaInfo: "flex items-center space-x-2 mt-1",

  // Product detail
  detailHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 shadow-sm",
  detailTitle: "text-lg font-semibold truncate",
  detailContent: "p-4 space-y-6 overflow-y-auto -webkit-overflow-scrolling-touch",
  detailMainSection: "flex flex-col space-y-4",
  detailImage: "w-full h-56 rounded-lg overflow-hidden bg-gray-100",
  detailImagePlaceholder: "w-full h-56 flex items-center justify-center bg-gray-100 rounded-lg",
  detailProductInfo: "space-y-3",
  detailProductTitle: "text-2xl font-bold text-gray-900 leading-7",
  detailProductLabel: "px-3 py-1 rounded-full text-sm inline-block font-medium",
  detailProductDescription: "text-gray-700 leading-6 text-base",
  detailCategoryInfo: "bg-gray-50 p-3 rounded-lg",
  detailCategoryLabel: "text-gray-600 font-medium text-sm",
  detailCategoryValue: "text-gray-900 font-semibold",
  detailUnavailableStatus: "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium",

  // Forms
  formContainer: "space-y-4",
  formActions: "flex flex-col space-y-3 pt-4",
  imageUploader: "space-y-2",
  imagePreview: "relative w-full h-48 mb-2 rounded-lg overflow-hidden",
  imageUploadButton: "cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-6 w-full text-center hover:bg-gray-50 touch-manipulation transition-colors",
  
  // Features and allergens
  featuresContainer: "space-y-3",
  featuresGrid: "flex flex-wrap gap-2 mt-2",
  featureTag: "px-3 py-2 rounded-full border text-sm cursor-pointer touch-manipulation transition-all min-h-[44px] flex items-center",
  featureTagSelected: "bg-primary text-primary-foreground border-primary",
  featureTagUnselected: "bg-white hover:bg-gray-50 active:bg-gray-100 border-gray-300",
  
  // Loading states
  skeletonItem: "h-16 w-full rounded-lg bg-gray-200 animate-pulse",
  skeletonProduct: "h-24 w-full rounded-lg bg-gray-200 animate-pulse",
  loadingSpinner: "space-y-3",

  // Empty states
  emptyState: "text-center py-12 text-gray-500",
  emptyStateIcon: "mx-auto h-12 w-12 text-gray-400 mb-4",
  emptyStateTitle: "text-lg font-medium text-gray-900 mb-2",
  emptyStateDescription: "text-gray-500 mb-6",
  
  // Common button sizes
  buttonSm: "h-10 w-10 touch-manipulation rounded-lg",
  buttonMd: "h-12 px-4 touch-manipulation rounded-lg font-medium",
  
  // Tables
  tableContainer: "space-y-3 overflow-x-auto",
  priceInfo: "text-lg font-semibold",
  priceVariants: "flex flex-col gap-2",
  priceVariant: "flex justify-between items-center p-3 bg-gray-50 rounded-lg",
  priceVariantValue: "text-gray-700 text-sm",

  // Multiple prices section
  multiplePricesContainer: "border rounded-lg p-4 space-y-4 bg-gray-50",
  multiplePricesTitle: "font-medium text-base",
  multiplePricesGrid: "grid grid-cols-1 gap-3",

  // Features display
  featuresDisplay: "bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm",
  featureIcon: "w-4 h-4 mr-1",

  // Allergens display  
  allergensDisplay: "bg-gray-100 rounded-full px-3 py-1 text-sm",

  // Tech info table
  techInfoTable: "space-y-2 overflow-x-auto",
  techInfoRow: "flex justify-between items-center p-3 bg-gray-50 rounded-lg",

  // Mobile specific improvements
  mobileScrollArea: "flex-1 overflow-y-auto -webkit-overflow-scrolling-touch",
  mobileTouchTarget: "min-h-[44px] min-w-[44px]",
  mobileSearchInput: "h-12 text-base rounded-lg", 
  mobileButtonGroup: "flex gap-3 flex-wrap",
  mobileDialog: "max-h-[90vh] overflow-hidden rounded-t-xl",
  
  // Animation classes
  fadeIn: "animate-in fade-in-0 duration-200",
  slideUp: "animate-in slide-in-from-bottom-2 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  
  // Touch feedback
  touchFeedback: "active:scale-[0.98] transition-transform duration-100",
  
  // Typography mobile
  mobileTitleLarge: "text-xl font-bold leading-6 text-gray-900",
  mobileTitleMedium: "text-lg font-semibold leading-6 text-gray-900",
  mobileTitleSmall: "text-base font-medium leading-5 text-gray-900",
  mobileBodyLarge: "text-base leading-6 text-gray-700",
  mobileBodyMedium: "text-sm leading-5 text-gray-600",
  mobileBodySmall: "text-xs leading-4 text-gray-500",
  
  // Spacing mobile
  mobileSpacingXs: "space-y-1",
  mobileSpacingSm: "space-y-2", 
  mobileSpacingMd: "space-y-3",
  mobileSpacingLg: "space-y-4",
  mobileSpacingXl: "space-y-6"
};
