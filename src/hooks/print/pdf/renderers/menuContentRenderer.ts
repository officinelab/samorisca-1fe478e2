
import jsPDF from 'jspdf';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { addCategoryToPdf, addCategoryNotesToPdf } from '../components/categoryRenderer';
import { addProductToPdf } from '../components/productRenderer';
import { addServiceChargeToPdf } from '../components/serviceChargeRenderer';

// Export all rendering functions for use in PDF generation
export {
  addCategoryToPdf,
  addCategoryNotesToPdf,
  addProductToPdf,
  addServiceChargeToPdf
};
