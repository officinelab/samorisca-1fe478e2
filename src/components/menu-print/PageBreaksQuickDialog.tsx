import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import PageBreaksTab from "@/components/menu-settings/print-layouts/editor/PageBreaksTab";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLayout?: PrintLayout;
}

const PageBreaksQuickDialog: React.FC<Props> = ({ open, onOpenChange, currentLayout }) => {
  const { updateLayout } = useMenuLayouts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraftIds(currentLayout?.pageBreaks?.categoryIds || []);
  }, [open, currentLayout]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (!active) return;
      if (error) {
        console.error("Errore caricamento categorie:", error);
        toast.error("Impossibile caricare le categorie");
      } else {
        setCategories((data as Category[]) || []);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [open]);

  const draftLayout: PrintLayout | null = currentLayout
    ? { ...currentLayout, pageBreaks: { categoryIds: draftIds } }
    : null;

  const handleSave = async () => {
    if (!currentLayout) return;
    setSaving(true);
    try {
      const updated: PrintLayout = {
        ...currentLayout,
        pageBreaks: { categoryIds: draftIds },
      };
      await updateLayout(updated);
      toast.success("Interruzioni di pagina aggiornate");
      window.dispatchEvent(new CustomEvent("layoutUpdated", { detail: { layout: updated } }));
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestisci interruzioni di pagina</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {loading || !draftLayout ? (
            <div className="py-8 text-center text-muted-foreground">Caricamento...</div>
          ) : (
            <PageBreaksTab
              layout={draftLayout}
              categories={categories}
              onPageBreaksChange={setDraftIds}
            />
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={saving || !currentLayout}>
            {saving ? "Salvataggio..." : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageBreaksQuickDialog;
