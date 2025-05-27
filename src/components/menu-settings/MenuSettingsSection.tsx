import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RestaurantNameSection from "./RestaurantNameSection";
import FooterTextSection from "./FooterTextSection";
import AdminTitleSection from "./AdminTitleSection";
import BrowserTitleSection from "./BrowserTitleSection";
import TokenPackageSection from "./TokenPackageSection";
import PublicMenuUrlSection from "./PublicMenuUrlSection";
import PublicMenuLanguagesSelector from "./PublicMenuLanguagesSelector";

const MenuSettingsSection = () => (
  <Card className="p-0 border border-card shadow-sm">
    <CardHeader>
      <CardTitle className="text-2xl">Impostazioni menu</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        <RestaurantNameSection />
        <FooterTextSection />
        <AdminTitleSection />
        <BrowserTitleSection />
        <TokenPackageSection />
        <PublicMenuUrlSection />
        <PublicMenuLanguagesSelector />
      </div>
    </CardContent>
  </Card>
);
export default MenuSettingsSection;
