
export interface PageContent {
  pageNumber: number;
  categories: {
    category: import('@/types/database').Category;
    notes: import('@/types/categoryNotes').CategoryNote[];
    products: import('@/types/database').Product[];
    isRepeatedTitle: boolean;
  }[];
  serviceCharge: number;
}

export interface PaginationConfig {
  A4_HEIGHT_MM: number;
  SAFETY_MARGIN_MM: number;
  STARTING_PAGE_NUMBER: number;
}
