
import React from 'react';

type PageBoundariesProps = {
  pageCount: number;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  MM_TO_PX_FACTOR: number;
};

const PageBoundaries: React.FC<PageBoundariesProps> = ({ 
  pageCount, 
  A4_WIDTH_MM, 
  A4_HEIGHT_MM, 
  MM_TO_PX_FACTOR 
}) => {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: pageCount }).map((_, index) => (
        <div 
          key={index} 
          className="relative mx-auto mb-16"
          style={{ 
            width: `${A4_WIDTH_MM * MM_TO_PX_FACTOR}px`, 
            height: `${A4_HEIGHT_MM * MM_TO_PX_FACTOR}px`,
            marginBottom: '60px', // Spazio maggiore tra le pagine per visualizzare chiaramente l'interruzione
          }}
        >
          {/* Bordo foglio A4 - Molto più visibile */}
          <div 
            className="absolute border-4 border-dashed border-red-400 bg-white"
            style={{ 
              width: '100%', 
              height: '100%',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
              zIndex: -1
            }}
          >
            {/* Indicatore tipo di pagina e numero */}
            <div 
              className="absolute top-4 left-4 bg-red-50 px-3 py-2 rounded-md text-sm text-red-800 font-semibold"
              style={{ opacity: 0.9 }}
            >
              {index === 0 ? 'Copertina' : 
               (index === pageCount - 1) ? 'Allergeni' : `Contenuto ${index}`}
            </div>
            
            {/* Indicatore numero pagina */}
            <div 
              className="absolute bottom-4 right-4 bg-red-50 px-3 py-2 rounded-md text-sm text-red-800 font-semibold"
              style={{ opacity: 0.9 }}
            >
              Pagina {index + 1} di {pageCount}
            </div>
            
            {/* Margini sicuri area di stampa - visualizzati come linee tratteggiate */}
            <div className="absolute border-2 border-blue-300 border-dashed m-8 inset-0"></div>
          </div>
          
          {/* Linea di interruzione pagina con sfondo colorato più evidente */}
          <div 
            className="absolute -bottom-10 left-0 right-0 h-12 flex flex-col items-center justify-center"
            style={{ 
              zIndex: 20,
            }}
          >
            <div className="w-full h-1 border-b-4 border-dashed border-red-500 relative mb-1"></div>
            <div className="bg-red-100 text-red-800 px-4 py-2 text-sm font-bold rounded-md shadow-sm">
              FINE PAGINA {index + 1} - INIZIO PAGINA {index + 2}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PageBoundaries;
