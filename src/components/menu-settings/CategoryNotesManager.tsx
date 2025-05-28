
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useCategoryNotes } from "@/hooks/useCategoryNotes";
import { CategoryNoteFormDialog } from "./category-notes/CategoryNoteFormDialog";
import { CategoryNote } from "@/types/categoryNotes";
import { Category } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

const CategoryNotesManager: React.FC = () => {
  const { categoryNotes, isLoading, createCategoryNote, updateCategoryNote, deleteCategoryNote } = useCategoryNotes();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CategoryNote | null>(null);

  // Carica le categorie
  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data) setCategories(data);
    };
    
    fetchCategories();
  }, []);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: CategoryNote) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa nota?")) {
      await deleteCategoryNote(id);
    }
  };

  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map(id => categories.find(cat => cat.id === id)?.title)
      .filter(Boolean);
  };

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Note Categorie</h3>
          <p className="text-sm text-muted-foreground">
            Gestisci le note che verranno mostrate nel menu pubblico dopo l'ultimo prodotto delle categorie selezionate.
          </p>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus size={16} className="mr-2" />
          Aggiungi Nota
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        {categoryNotes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>Nessuna nota categoria presente.</p>
                <p className="text-sm">Clicca su "Aggiungi Nota" per iniziare.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          categoryNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-muted-foreground cursor-grab" />
                    {note.icon_url && (
                      <img src={note.icon_url} alt="" className="w-6 h-6 object-contain" />
                    )}
                    <CardTitle className="text-base">{note.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{note.text}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-medium mr-2">Categorie:</span>
                  {note.categories && note.categories.length > 0 ? (
                    getCategoryNames(note.categories).map((categoryName, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {categoryName}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Nessuna categoria
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CategoryNoteFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingNote ? updateCategoryNote : createCategoryNote}
        categories={categories}
        initialData={editingNote}
      />
    </div>
  );
};

export default CategoryNotesManager;
