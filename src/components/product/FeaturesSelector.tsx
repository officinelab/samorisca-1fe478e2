
import React from "react";
import { ProductFeature } from "@/types/database";
import CollapsibleSection from "@/components/dashboard/CollapsibleSection";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FeaturesSelectorProps {
  selectedFeatureIds: string[];
  onToggleFeature: (featureId: string) => void;
}

const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({
  selectedFeatureIds,
  onToggleFeature,
}) => {
  const [features, setFeatures] = React.useState<ProductFeature[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Caricamento una volta sola
  React.useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_features")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setFeatures(data || []);
      } catch (error) {
        console.error("Errore nel caricamento delle caratteristiche:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  return (
    <CollapsibleSection title="Caratteristiche" defaultOpen={false}>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Caricamento caratteristiche...</div>
      ) : features.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nessuna caratteristica disponibile</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                selectedFeatureIds.includes(feature.id) ? "border-primary bg-muted/50" : "border-input"
              )}
              onClick={() => onToggleFeature(feature.id)}
            >
              <Checkbox
                checked={selectedFeatureIds.includes(feature.id)}
                onCheckedChange={() => onToggleFeature(feature.id)}
              />
              <span className="text-sm">{feature.title}</span>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default FeaturesSelector;
