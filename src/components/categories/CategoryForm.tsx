
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";

interface CategoryFormProps {
  category?: Category | null;
  onSave: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setIsActive(category.is_active);
    } else {
      setTitle("");
      setIsActive(true);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Errore",
        description: "Il nome della categoria è obbligatorio.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            title: title.trim(),
            is_active: isActive
          })
          .eq("id", category.id);

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Categoria aggiornata con successo."
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert({
            title: title.trim(),
            is_active: isActive,
            display_order: 0
          });

        if (error) throw error;

        toast({
          title: "Successo",
          description: "Categoria creata con successo."
        });
      }

      onSave();
    } catch (error) {
      console.error("Errore nel salvataggio della categoria:", error);
      toast({
        title: "Errore",
        description: "Errore nel salvataggio della categoria.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nome Categoria</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Inserisci il nome della categoria"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="is_active">Categoria attiva</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annulla
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvataggio..." : category ? "Aggiorna" : "Crea"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
