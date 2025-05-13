
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  useTranslationService, 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES,
  TranslationStats,
  TokenStats
} from "@/hooks/translations/useTranslationService";
import CategoryTranslations from "@/components/translations/CategoryTranslations";
import ProductTranslations from "@/components/translations/ProductTranslations";
import AllergenTranslations from "@/components/translations/AllergenTranslations";
import FeatureTranslations from "@/components/translations/FeatureTranslations";

const TranslationManager = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const { 
    getTranslationStats, 
    fetchTokenStats,
  } = useTranslationService();
  
  const [stats, setStats] = useState<{
    categories: TranslationStats;
    products: TranslationStats;
    allergens: TranslationStats;
    features: TranslationStats;
  }>({
    categories: {
      total: 0,
      translated: { en: 0, fr: 0, es: 0, de: 0 },
      untranslated: { en: 0, fr: 0, es: 0, de: 0 }
    },
    products: {
      total: 0,
      translated: { en: 0, fr: 0, es: 0, de: 0 },
      untranslated: { en: 0, fr: 0, es: 0, de: 0 }
    },
    allergens: {
      total: 0,
      translated: { en: 0, fr: 0, es: 0, de: 0 },
      untranslated: { en: 0, fr: 0, es: 0, de: 0 }
    },
    features: {
      total: 0,
      translated: { en: 0, fr: 0, es: 0, de: 0 },
      untranslated: { en: 0, fr: 0, es: 0, de: 0 }
    }
  });
  
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  
  // Carica le statistiche all'avvio
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    const categoriesStats = await getTranslationStats('category');
    const productsStats = await getTranslationStats('product');
    const allergensStats = await getTranslationStats('allergen');
    const featuresStats = await getTranslationStats('product_feature');
    const tokens = await fetchTokenStats();
    
    setStats({
      categories: categoriesStats,
      products: productsStats,
      allergens: allergensStats,
      features: featuresStats
    });
    
    if (tokens) {
      setTokenStats(tokens);
    }
  };
  
  const refreshStats = () => {
    loadStats();
  };
  
  return (
    <div className="w-full py-6">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Gestione Multilingua</h1>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Stato Token */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Token di Traduzione</CardTitle>
              <CardDescription>Limite mensile</CardDescription>
            </CardHeader>
            <CardContent>
              {tokenStats ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Utilizzati: {tokenStats.used} / {tokenStats.limit}
                    </span>
                    <span className="text-sm font-medium">
                      {Math.floor((tokenStats.remaining / tokenStats.limit) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(tokenStats.remaining / tokenStats.limit) * 100} 
                    className="h-2" 
                  />
                  <p className="text-sm mt-2 text-muted-foreground">
                    {tokenStats.remaining} token rimanenti
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Caricamento...</p>
              )}
            </CardContent>
          </Card>
          
          {/* Stato Categorie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categorie</CardTitle>
              <CardDescription>{stats.categories.total} totali</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => {
                  const lang = code as SupportedLanguage;
                  const percentage = stats.categories.total 
                    ? Math.floor((stats.categories.translated[lang] / stats.categories.total) * 100)
                    : 0;
                  
                  return (
                    <div key={code}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Stato Prodotti */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prodotti</CardTitle>
              <CardDescription>{stats.products.total} totali</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => {
                  const lang = code as SupportedLanguage;
                  const percentage = stats.products.total 
                    ? Math.floor((stats.products.translated[lang] / stats.products.total) * 100)
                    : 0;
                  
                  return (
                    <div key={code}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Stato Allergeni */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Allergeni</CardTitle>
              <CardDescription>{stats.allergens.total} totali</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => {
                  const lang = code as SupportedLanguage;
                  const percentage = stats.allergens.total 
                    ? Math.floor((stats.allergens.translated[lang] / stats.allergens.total) * 100)
                    : 0;
                  
                  return (
                    <div key={code}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="categories">Categorie</TabsTrigger>
            <TabsTrigger value="products">Prodotti</TabsTrigger>
            <TabsTrigger value="allergens">Allergeni</TabsTrigger>
            <TabsTrigger value="features">Caratteristiche</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <CategoryTranslations onTranslationComplete={refreshStats} />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <ProductTranslations onTranslationComplete={refreshStats} />
          </TabsContent>
          
          <TabsContent value="allergens" className="space-y-4">
            <AllergenTranslations onTranslationComplete={refreshStats} />
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <FeatureTranslations onTranslationComplete={refreshStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TranslationManager;
