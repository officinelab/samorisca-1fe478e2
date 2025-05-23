
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AdminTitleSection = () => {
  const { siteSettings, updateAdminTitle } = useSiteSettings();
  const [adminTitle, setAdminTitle] = useState(siteSettings?.adminTitle || "Sa Morisca Menu - Amministrazione");

  useEffect(() => {
    if (siteSettings?.adminTitle) setAdminTitle(siteSettings.adminTitle);
  }, [siteSettings]);

  const handleSave = () => updateAdminTitle(adminTitle);

  return (
    <div>
      <Label htmlFor="admin-title" className="font-semibold">Titolo intestazione admin</Label>
      <p className="text-sm text-muted-foreground mb-2">Titolo visualizzato nell'intestazione dell'area amministrativa</p>
      <div className="flex items-center gap-2 max-w-md">
        <Input
          id="admin-title"
          value={adminTitle}
          onChange={e => setAdminTitle(e.target.value)}
          placeholder="Titolo intestazione"
        />
        <Button onClick={handleSave}>Salva</Button>
      </div>
    </div>
  );
};
export default AdminTitleSection;
