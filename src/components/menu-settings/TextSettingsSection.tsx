
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import RestaurantNameSection from "./RestaurantNameSection";
import AdminTitleSection from "./AdminTitleSection";
import FooterTextSection from "./FooterTextSection";
import BrowserTitleSection from "./BrowserTitleSection";
import TokenPackageSection from "./TokenPackageSection";

const TextSettingsSection = () => {
  return (
    <Card className="p-0 border border-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Testi mostrati nel sito</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <RestaurantNameSection />
          <Separator className="my-4" />
          <AdminTitleSection />
          <Separator className="my-4" />
          <FooterTextSection />
          <Separator className="my-8" />
          <BrowserTitleSection />
          <Separator className="my-8" />
          <TokenPackageSection />
        </div>
      </CardContent>
    </Card>
  );
};

export default TextSettingsSection;
