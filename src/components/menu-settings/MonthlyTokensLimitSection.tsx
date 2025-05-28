
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const MonthlyTokensLimitSection = () => {
  const { siteSettings, saveSetting } = useSiteSettings();
  const [monthlyLimit, setMonthlyLimit] = useState(siteSettings.monthlyTokensLimit || "300");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!monthlyLimit || parseInt(monthlyLimit) <= 0) {
      toast.error("Il limite mensile deve essere maggiore di 0");
      return;
    }

    setIsSaving(true);
    try {
      const success = await saveSetting("monthlyTokensLimit", monthlyLimit);
      if (success) {
        toast.success("Limite mensile token aggiornato con successo");
        // Trigger refresh dei token per aggiornare i valori
        window.dispatchEvent(new CustomEvent("refresh-tokens"));
      } else {
        toast.error("Errore nel salvataggio del limite mensile");
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      toast.error("Errore nel salvataggio del limite mensile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limite Token Mensili Gratuiti</CardTitle>
        <CardDescription>
          Configura il numero di token gratuiti assegnati ogni mese agli utenti.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyLimit">Token mensili gratuiti</Label>
          <div className="flex gap-2">
            <Input
              id="monthlyLimit"
              type="number"
              min="1"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="300"
              className="max-w-xs"
            />
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              variant="outline"
            >
              {isSaving ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Valore attuale: {siteSettings.monthlyTokensLimit || "300"} token per mese
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTokensLimitSection;
