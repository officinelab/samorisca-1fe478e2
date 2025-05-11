
/**
 * CSS styles for the cover page
 */
export const getCoverPageStyles = (): string => {
  return `
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
    }

    .cover-page-logo {
      max-width: 80%;
      max-height: 150px;
      object-fit: contain;
      margin-bottom: 15mm;
    }

    .cover-title {
      font-size: 36pt;
      font-weight: bold;
      margin-bottom: 10mm;
    }

    .cover-subtitle {
      font-size: 18pt;
      margin-bottom: 20mm;
    }

    .page-number {
      position: absolute;
      bottom: 10mm;
      right: 15mm;
      font-size: 10pt;
      color: #888;
    }
  `;
};
