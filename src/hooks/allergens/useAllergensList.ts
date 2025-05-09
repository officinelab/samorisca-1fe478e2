
import { useState, useEffect } from "react";
import { Allergen } from "@/types/database";
import { fetchAllergens } from "./allergensService";

export const useAllergensList = () => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load allergens on component mount
  useEffect(() => {
    const loadAllergens = async () => {
      setIsLoading(true);
      const data = await fetchAllergens();
      setAllergens(data);
      setIsLoading(false);
    };

    loadAllergens();
  }, []);

  return {
    allergens,
    setAllergens,
    isLoading
  };
};
