
export const dashboardStyles = {
  // Main layout
  container: "h-[calc(100vh-3.5rem)]", // Ridotto da 4rem a 3.5rem per header più compatto
  desktopGrid: "grid grid-cols-12 h-full divide-x",
  categoriesColumn: "col-span-2 h-full border-r",
  productsColumn: "col-span-5 h-full border-r", 
  detailColumn: "col-span-5 h-full",

  // Mobile optimizations - MIGLIORATI
  mobileContainer: "h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50",
  mobileHeader: "flex-shrink-0 px-4 py-3 border-b bg-white sticky top-0 z-10 shadow-sm",
  mobileContent: "flex-1 overflow-hidden bg-white",
  mobileBackButton: "mr-3 touch-manipulation min-h-[44px] min-w-[44px] hover:bg-gray-100 active:bg-gray-200 transition-colors rounded-md",
  mobileTitle: "text-lg font-semibold truncate flex-1",
  mobileBreadcrumb: "text-sm text-gray-500 truncate",

  // Enhanced mobile header with breadcrumb
  mobileHeaderContent: "flex items-center justify-between w-full",
  mobileHeaderLeft: "flex items-center flex-1 min-w-0",
  mobileHeaderRight: "flex items-center gap-2 ml-3",

  // Categories list - MIGLIORATI
  categoriesHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 shadow-sm",
  categoriesTitle: "text-lg font-semibold",
  categoryItem: "flex flex-col p-4 rounded-lg cursor-pointer touch-manipulation min-h-[68px] mx-2 my-1 bg-white border shadow-sm hover:shadow-md transition-all duration-200",
  categoryItemSelected: "bg-primary text-primary-foreground shadow-md border-primary",
  categoryItemHover: "hover:bg-gray-50 active:bg-gray-100",
  categoryItemInactive: "opacity-60",
  categoryContent: "flex items-center justify-between",
  categoryActions: "flex justify-end mt-3 gap-2",
  categoryReorderActions: "flex mr-2 gap-1",
  categoryInactiveLabel: "text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-medium",

  // Products list - MIGLIORATI
  productsHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 shadow-sm",
  productItem: "border rounded-lg p-4 cursor-pointer transition-all duration-200 touch-manipulation min-h-[88px] mx-2 my-1 bg-white shadow-sm hover:shadow-md",
  productItemSelected: "border-primary bg-primary/5 shadow-md",
  productItemHover: "hover:bg-gray-50 active:bg-gray-100",
  productItemInactive: "opacity-60",
  productContent: "flex space-x-3",
  productImage: "w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm",
  productImagePlaceholder: "w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0 border",
  productDetails: "flex-1 min-w-0",
  productTitle: "font-semibold truncate text-gray-900",
  productDescription: "text-sm text-gray-600 line-clamp-2 mt-1",
  productPrice: "text-sm font-semibold text-primary mt-2",
  productPriceSuffix: "text-xs text-gray-500",
  productUnavailable: "text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium",
  productAllergens: "flex space-x-1 flex-wrap mt-2",
  productAllergenTag: "text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full",
  productActions: "flex justify-end mt-3 gap-2",
  productReorderActions: "flex mr-2 gap-1",

  // Product detail - MIGLIORATI
  detailHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 shadow-sm",
  detailTitle: "text-lg font-semibold truncate",
  detailContent: "p-4 space-y-6 overflow-y-auto bg-gray-50",
  detailMainSection: "flex flex-col space-y-4 bg-white rounded-lg p-4 shadow-sm",
  detailImage: "w-full h-48 rounded-lg overflow-hidden shadow-sm",
  detailImagePlaceholder: "w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg border",
  detailProductInfo: "flex-1 min-w-0",
  detailProductTitle: "text-xl font-bold text-gray-900",
  detailProductLabel: "px-3 py-1 rounded-full text-sm inline-block mt-2 font-medium",
  detailProductDescription: "text-gray-700 mt-3 leading-relaxed",
  detailCategoryInfo: "mt-4 p-3 bg-gray-50 rounded-lg",
  detailCategoryLabel: "text-gray-600 font-medium text-sm",
  detailCategoryValue: "ml-2 text-gray-900",
  detailUnavailableStatus: "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium",

  // Forms - MIGLIORATI
  formContainer: "space-y-6",
  formActions: "flex flex-col gap-3 pt-6 border-t",
  imageUploader: "space-y-3",
  imagePreview: "relative w-full h-40 mb-3 rounded-lg overflow-hidden",
  imageUploadButton: "cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 w-full text-center hover:bg-gray-50 touch-manipulation transition-colors",
  
  // Features and allergens - MIGLIORATI
  featuresContainer: "space-y-3",
  featuresGrid: "flex flex-wrap gap-2 mt-3",
  featureTag: "px-4 py-2 rounded-full border text-sm cursor-pointer touch-manipulation min-h-[44px] transition-all duration-200",
  featureTagSelected: "bg-primary text-primary-foreground border-primary shadow-sm",
  featureTagUnselected: "bg-white hover:bg-gray-50 active:bg-gray-100 border-gray-300",
  
  // Loading states
  skeletonItem: "h-16 w-full rounded-lg",
  skeletonProduct: "h-20 w-full rounded-lg",
  loadingSpinner: "space-y-3",

  // Empty states - MIGLIORATI
  emptyState: "text-center py-12 text-gray-500 bg-gray-50 rounded-lg m-4",
  
  // Common button sizes - MIGLIORATI per touch
  buttonSm: "h-10 w-10 touch-manipulation rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors",
  
  // Tables
  tableContainer: "space-y-4 overflow-x-auto",
  priceInfo: "text-lg font-semibold text-gray-900",
  priceVariants: "flex flex-col gap-2",
  priceVariant: "flex justify-between items-center p-3 bg-gray-50 rounded-lg",
  priceVariantValue: "text-gray-700",

  // Multiple prices section - MIGLIORATI
  multiplePricesContainer: "border rounded-lg p-4 space-y-4 bg-white shadow-sm",
  multiplePricesTitle: "font-semibold text-gray-900",
  multiplePricesGrid: "grid grid-cols-1 gap-3",

  // Features display - MIGLIORATI
  featuresDisplay: "bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center",
  featureIcon: "w-4 h-4 mr-2 text-blue-600",

  // Allergens display - MIGLIORATI
  allergensDisplay: "bg-orange-50 border border-orange-200 rounded-lg px-3 py-2",

  // Tech info table
  techInfoTable: "space-y-2 overflow-x-auto",

  // Mobile specific improvements - NUOVI
  mobileScrollArea: "flex-1 overflow-y-auto -webkit-overflow-scrolling-touch",
  mobileTouchTarget: "min-h-[44px] min-w-[44px]",
  mobileSearchInput: "h-12 text-base rounded-lg border-gray-300 focus:border-primary focus:ring-primary", 
  mobileButtonGroup: "flex gap-3 flex-wrap",
  mobileDialog: "max-h-[90vh] overflow-hidden rounded-t-xl",
  
  // Navigation helpers - NUOVI
  navigationIndicator: "flex items-center text-sm text-gray-500 mb-2",
  navigationDivider: "mx-2 text-gray-300",
  
  // Status indicators - MIGLIORATI
  statusActive: "bg-green-100 text-green-800 border-green-200",
  statusInactive: "bg-gray-100 text-gray-600 border-gray-200",
  
  // Action buttons - MIGLIORATI per mobile
  actionButton: "h-12 px-4 font-medium rounded-lg touch-manipulation transition-all duration-200 shadow-sm hover:shadow-md",
  actionButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
  actionButtonSecondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  actionButtonDanger: "bg-red-600 text-white hover:bg-red-700",
};
