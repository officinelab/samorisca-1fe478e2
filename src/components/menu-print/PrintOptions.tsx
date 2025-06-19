
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicOptions from "./options/BasicOptions";

interface PrintOptionsProps {
  language: string;
  setLanguage: (language: string) => void;
  layoutId: string;
  setLayoutId: (layoutId: string) => void;
  printAllergens: boolean;
  setPrintAllergens: (print: boolean) => void;
  showPageBoundaries: boolean;
  setShowPageBoundaries: (show: boolean) => void;
  isLoading: boolean;
  restaurantLogo: string | null;
  updateRestaurantLogo: (newLogo: string | null) => void;
}

const PrintOptions = ({
  language,
  setLanguage,
  layoutId,
  setLayoutId,
  printAllergens,
  setPrintAllergens,
  showPageBoundaries,
  setShowPageBoundaries,
  isLoading,
  restaurantLogo,
  updateRestaurantLogo
}: PrintOptionsProps) => {
  return (
    <div className="w-full">
      <BasicOptions
        language={language}
        setLanguage={setLanguage}
        layoutId={layoutId}
        setLayoutId={setLayoutId}
        printAllergens={printAllergens}
        setPrintAllergens={setPrintAllergens}
        showPageBoundaries={showPageBoundaries}
        setShowPageBoundaries={setShowPageBoundaries}
        isLoading={isLoading}
        restaurantLogo={restaurantLogo}
        updateRestaurantLogo={updateRestaurantLogo}
      />
    </div>
  );
};

export default PrintOptions;
