

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconUploader } from "./IconUploader";
import { Allergen } from "@/types/database";

interface AllergenFormProps {
  initialData?: Allergen;
  onSubmit: (data: Partial<Allergen>) => void;
  onCancel: () => void;
}

const AllergenForm = ({ initialData, onSubmit, onCancel }: AllergenFormProps) => {
  const [number, setNumber] = useState(initialData?.number?.toString() || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [iconUrl, setIconUrl] = useState<string | null>(initialData?.icon_url || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      number: number ? parseInt(number) : undefined,
      title,
      description: description || null,
      icon_url: iconUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="number">Numero</Label>
        <Input 
          id="number"
          type="number"
          min="1"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Numero identificativo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Titolo</Label>
        <Input 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome dell'allergene"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione dell'allergene"
          rows={3}
        />
      </div>
      
      <IconUploader 
        currentIcon={iconUrl} 
        onIconUploaded={setIconUrl} 
      />
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
        <Button type="submit">Salva</Button>
      </div>
    </form>
  );
};

export default AllergenForm;
