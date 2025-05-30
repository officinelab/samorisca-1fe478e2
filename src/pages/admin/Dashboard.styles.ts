
export const dashboardStyles = {
  // Main layout
  container: "h-[calc(100vh-4rem)]",
  desktopGrid: "grid grid-cols-12 h-full divide-x",
  categoriesColumn: "col-span-2 h-full border-r",
  productsColumn: "col-span-5 h-full border-r", 
  detailColumn: "col-span-5 h-full",

  // Mobile optimizations
  mobileContainer: "h-[calc(100vh-4rem)] flex flex-col",
  mobileHeader: "flex-shrink-0 p-3 border-b bg-white sticky top-0 z-10",
  mobileContent: "flex-1 overflow-hidden",
  mobileBackButton: "mr-2 touch-manipulation",
  mobileTitle: "text-lg font-semibold truncate",

  // Categories list
  categoriesHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10",
  categoriesTitle: "text-lg font-semibold",
  categoryItem: "flex flex-col p-3 rounded-md cursor-pointer touch-manipulation min-h-[60px]",
  categoryItemSelected: "bg-primary text-primary-foreground",
  categoryItemHover: "hover:bg-gray-100 active:bg-gray-200",
  categoryItemInactive: "opacity-60",
  categoryContent: "flex items-center justify-between",
  categoryActions: "flex justify-end mt-2 gap-1",
  categoryReorderActions: "flex mr-1 gap-1",
  categoryInactiveLabel: "text-sm px-2 py-0.5 rounded-full bg-gray-200 text-gray-700",

  // Products list  
  productsHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10",
  productItem: "border rounded-md p-3 cursor-pointer transition-colors touch-manipulation min-h-[80px]",
  productItemSelected: "border-primary bg-primary/5",
  productItemHover: "hover:bg-gray-50 active:bg-gray-100",
  productItemInactive: "opacity-60",
  productContent: "flex space-x-3",
  productImage: "w-16 h-16 rounded-md overflow-hidden flex-shrink-0",
  productImagePlaceholder: "w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0",
  productDetails: "flex-1 min-w-0",
  productTitle: "font-medium truncate",
  productDescription: "text-sm text-gray-500 line-clamp-2",
  productPrice: "text-sm font-semibold",
  productPriceSuffix: "text-xs text-gray-500",
  productUnavailable: "text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded",
  productAllergens: "flex space-x-1 flex-wrap",
  productAllergenTag: "text-xs bg-gray-100 text-gray-700 px-1 rounded-full",
  productActions: "flex justify-end mt-2 gap-1",
  productReorderActions: "flex mr-1 gap-1",

  // Product detail
  detailHeader: "flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10",
  detailTitle: "text-lg font-semibold truncate",
  detailContent: "p-4 space-y-6 overflow-y-auto",
  detailMainSection: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
  detailImage: "w-full sm:w-32 h-48 sm:h-32 rounded-md overflow-hidden",
  detailImagePlaceholder: "w-full sm:w-32 h-48 sm:h-32 flex items-center justify-center bg-gray-100 rounded-md",
  detailProductInfo: "flex-1 min-w-0",
  detailProductTitle: "text-xl sm:text-2xl font-bold",
  detailProductLabel: "px-2 py-0.5 rounded-full text-sm inline-block mt-1",
  detailProductDescription: "text-gray-700 mt-2",
  detailCategoryInfo: "mt-4",
  detailCategoryLabel: "text-gray-600 font-medium",
  detailCategoryValue: "ml-2",
  detailUnavailableStatus: "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm",

  // Forms
  formContainer: "space-y-4",
  formActions: "flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4",
  imageUploader: "space-y-2",
  imagePreview: "relative w-full h-36 mb-2",
  imageUploadButton: "cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-3 w-full text-center hover:bg-gray-50 touch-manipulation",
  
  // Features and allergens
  featuresContainer: "space-y-2",
  featuresGrid: "flex flex-wrap gap-2 mt-2",
  featureTag: "px-3 py-2 rounded-full border text-sm cursor-pointer touch-manipulation",
  featureTagSelected: "bg-primary text-primary-foreground",
  featureTagUnselected: "bg-white hover:bg-gray-50 active:bg-gray-100",
  
  // Loading states
  skeletonItem: "h-12 w-full",
  skeletonProduct: "h-20 w-full",
  loadingSpinner: "space-y-2",

  // Empty states
  emptyState: "text-center py-8 text-gray-500",
  
  // Common button sizes
  buttonSm: "h-8 w-8 touch-manipulation",
  
  // Tables
  tableContainer: "space-y-3 overflow-x-auto",
  priceInfo: "text-lg font-semibold",
  priceVariants: "flex flex-col gap-1",
  priceVariant: "flex justify-between items-center",
  priceVariantValue: "text-gray-700 text-sm",

  // Multiple prices section
  multiplePricesContainer: "border rounded-md p-4 space-y-4 bg-gray-50",
  multiplePricesTitle: "font-medium",
  multiplePricesGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3",

  // Features display
  featuresDisplay: "bg-gray-100 rounded-full px-3 py-1 flex items-center",
  featureIcon: "w-4 h-4 mr-1",

  // Allergens display  
  allergensDisplay: "bg-gray-100 rounded-full px-3 py-1",

  // Tech info table
  techInfoTable: "space-y-1 overflow-x-auto",

  // Mobile specific improvements
  mobileScrollArea: "flex-1 overflow-y-auto -webkit-overflow-scrolling-touch",
  mobileTouchTarget: "min-h-[44px] min-w-[44px]",
  mobileSearchInput: "h-10 text-base", // Prevents zoom on iOS
  mobileButtonGroup: "flex gap-2 flex-wrap",
  mobileDialog: "max-h-[90vh] overflow-hidden"
};
