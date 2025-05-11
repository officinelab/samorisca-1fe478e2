
import React from 'react';
import { Category, Product } from '@/types/database';

interface PageOrganizerProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
}

// Convert PageOrganizer to a hook that returns the organized pages
export const usePageOrganizer = ({
  categories,
  products,
  selectedCategories,
}: PageOrganizerProps) => {
  // Calculate if a category has too many items and should start on a new page
  const shouldStartNewPage = (category: Category, prevCategoryIndex: number) => {
    // If it's the first category, no new page needed
    if (prevCategoryIndex < 0) return false;
    
    // If the previous category has more than X elements, start a new page
    const prevCategoryItems = products[categories[prevCategoryIndex].id]?.length || 0;
    return prevCategoryItems > 8;
  };

  // Array to track categories grouped by page
  let pages: Category[][] = [];
  let currentPage: Category[] = [];
  
  // Group categories into pages
  categories
    .filter(category => selectedCategories.includes(category.id))
    .forEach((category, index, filteredCategories) => {
      const prevIndex = index > 0 ? filteredCategories.indexOf(filteredCategories[index - 1]) : -1;
      
      // If category should start a new page and we already have categories on current page
      if (shouldStartNewPage(category, prevIndex) && currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [category];
      } else {
        currentPage.push(category);
      }
    });
  
  // Add the last page if it contains categories
  if (currentPage.length > 0) {
    pages.push([...currentPage]);
  }
  
  // If no pages, create at least one empty page
  if (pages.length === 0) {
    pages = [[]];
  }
  
  return pages;
};

export default usePageOrganizer;
