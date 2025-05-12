
import { CSSProperties } from "react";

export const getPageStyle = (A4_WIDTH_MM: number, A4_HEIGHT_MM: number, showPageBoundaries: boolean): CSSProperties => ({
  width: `${A4_WIDTH_MM}mm`,
  height: `${A4_HEIGHT_MM}mm`,
  padding: '20mm 15mm',
  boxSizing: 'border-box',
  margin: '0 auto 60px auto',
  pageBreakAfter: 'always',
  breakAfter: 'page',
  border: showPageBoundaries ? '2px solid #e2e8f0' : 'none',
  boxShadow: showPageBoundaries ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
});
