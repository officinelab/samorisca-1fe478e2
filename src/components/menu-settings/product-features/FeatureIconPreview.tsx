
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeatureIconPreviewProps {
  iconUrl: string | null;
  title: string;
}

export const FeatureIconPreview: React.FC<FeatureIconPreviewProps> = ({ 
  iconUrl, 
  title 
}) => {
  const [isLoading, setIsLoading] = React.useState(!!iconUrl);
  const [hasError, setHasError] = React.useState(false);

  if (!iconUrl) {
    return <span className="text-muted-foreground">Nessuna icona</span>;
  }

  return (
    <div className="flex items-center">
      {isLoading && <Skeleton className="h-6 w-6 mr-2 rounded" />}
      <img 
        src={iconUrl} 
        alt={title}
        className={`h-6 w-6 object-contain mr-2 ${isLoading ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {hasError ? (
        <span className="text-destructive text-xs">Errore caricamento immagine</span>
      ) : (
        <span className="text-xs text-muted-foreground overflow-hidden text-ellipsis max-w-[150px]">
          {iconUrl.split('/').pop()}
        </span>
      )}
    </div>
  );
};

export default FeatureIconPreview;
