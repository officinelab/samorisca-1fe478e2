
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslationHeader } from "@/components/multilingual/TranslationHeader";
import { GeneralTranslationsTab } from "@/components/multilingual/GeneralTranslationsTab";
import { ProductTranslationsTab } from "@/components/multilingual/ProductTranslationsTab";
import { SupportedLanguage } from "@/types/translation";

const MultilingualPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Multilingua</h1>
      </div>

      <div className="flex-1 flex flex-col">
        <TranslationHeader 
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        
        <div className="flex-1 py-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">Generale</TabsTrigger>
              <TabsTrigger value="products">Voci di menu</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <GeneralTranslationsTab language={selectedLanguage} />
            </TabsContent>
            <TabsContent value="products">
              <ProductTranslationsTab language={selectedLanguage} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MultilingualPage;
