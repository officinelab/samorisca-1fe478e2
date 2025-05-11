
import { useState, useEffect } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

export const useAllergens = () => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAllergens = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllergens();
        setAllergens(data);
      } catch (error) {
        console.error("Errore nel caricamento degli allergeni:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllergens();
  }, []);

  return { allergens, isLoading };
};
