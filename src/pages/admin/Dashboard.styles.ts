
export const dashboardStyles = {
  // Main layout
  container: "h-[calc(100vh-4rem)]",
  desktopGrid: "grid grid-cols-12 h-full divide-x",
  categoriesColumn: "col-span-2 h-full border-r",
  productsColumn: "col-span-5 h-full border-r", 
  detailColumn: "col-span-5 h-full",

  // Categories list
  categoriesHeader: "flex justify-between items-center p-4 border-b",
  categoriesTitle: "text-lg font-semibold",
  // Aggiornamento: più padding per categoryItem
  categoryItem: "p-3 rounded-md cursor-pointer",
  categoryItemSelected: "bg-primary text-primary-foreground",
  categoryItemHover: "hover:bg-gray-100",
  categoryItemInactive: "opacity-60",
-  categoryContent: "flex items-center justify-between", // Non serve più
-  categoryActions: "flex justify-end mt-2",              // Non serve più
-  categoryReorderActions: "flex mr-1",                   // Non serve più
  categoryInactiveLabel: "text-sm px-2 py-0.5 rounded-full bg-gray-200 text-gray-700",

  // Products list  
  productsHeader: "flex justify-between items-center p-4 border-b",
  productItem: "border rounded-md p-3 cursor-pointer transition-colors",
  productItemSelected: "border-primary bg-primary/5",
  productItemHover: "hover:bg-gray-50",
  productItemInactive: "opacity-60",
  productContent: "flex space-x-3",
  productImage: "w-16 h-16 rounded-md overflow-hidden flex-shrink-0",
  productImagePlaceholder: "w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md flex-shrink-0",
  productDetails: "flex-1",
  productTitle: "font-medium",
  productDescription: "text-sm text-gray-500 line-clamp-2",
  productPrice: "text-sm font-semibold",
  productPriceSuffix: "text-xs text-gray-500",
  productUnavailable: "text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded",
  productAllergens: "flex space-x-1",
  productAllergenTag: "text-xs bg-gray-100 text-gray-700 px-1 rounded-full",
  productActions: "flex justify-end mt-2",
  productReorderActions: "flex mr-1",

  // Product detail
  detailHeader: "flex justify-between items-center p-4 border-b",
  detailTitle: "text-lg font-semibold",
  detailContent: "p-4 space-y-6",
  detailMainSection: "flex space-x-4",
  detailImage: "w-32 h-32 rounded-md overflow-hidden",
  detailImagePlaceholder: "w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md",
  detailProductInfo: "flex-1",
  detailProductTitle: "text-2xl font-bold",
  detailProductLabel: "px-2 py-0.5 rounded-full text-sm inline-block mt-1",
  detailProductDescription: "text-gray-700 mt-2",
  detailCategoryInfo: "mt-4",
  detailCategoryLabel: "text-gray-600 font-medium",
  detailCategoryValue: "ml-2",
  detailUnavailableStatus: "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm",

  // Forms
  formContainer: "space-y-4",
  formActions: "flex justify-end space-x-2 pt-4",
  imageUploader: "space-y-2",
  imagePreview: "relative w-full h-36 mb-2",
  imageUploadButton: "cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-2 w-full text-center hover:bg-gray-50",
  
  // Features and allergens
  featuresContainer: "space-y-2",
  featuresGrid: "flex flex-wrap gap-2 mt-2",
  featureTag: "px-3 py-1 rounded-full border text-sm cursor-pointer",
  featureTagSelected: "bg-primary text-primary-foreground",
  featureTagUnselected: "bg-white hover:bg-gray-50",
  
  // Loading states
  skeletonItem: "h-12 w-full",
  skeletonProduct: "h-20 w-full",
  loadingSpinner: "space-y-2",

  // Empty states
  emptyState: "text-center py-8 text-gray-500",
  
  // Mobile navigation
  mobileBackButton: "mr-2",
  
  // Common button sizes
  buttonSm: "h-6 w-6",
  
  // Tables
  tableContainer: "space-y-3",
  priceInfo: "text-lg font-semibold",
  priceVariants: "flex flex-col gap-1",
  priceVariant: "flex justify-between items-center",
  priceVariantValue: "text-gray-700 text-sm",

  // Multiple prices section
  multiplePricesContainer: "border rounded-md p-4 space-y-4 bg-gray-50",
  multiplePricesTitle: "font-medium",
  multiplePricesGrid: "grid grid-cols-2 gap-3",

  // Features display
  featuresDisplay: "bg-gray-100 rounded-full px-3 py-1 flex items-center",
  featureIcon: "w-4 h-4 mr-1",

  // Allergens display  
  allergensDisplay: "bg-gray-100 rounded-full px-3 py-1",

  // Tech info table
  techInfoTable: "space-y-1"
};
