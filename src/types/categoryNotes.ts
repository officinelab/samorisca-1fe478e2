
export interface CategoryNote {
  id: string;
  title: string;
  text: string;
  icon_url: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  categories?: string[]; // Array di category_id per le categorie selezionate
}

export interface CategoryNoteCategory {
  id: string;
  note_id: string;
  category_id: string;
  created_at?: string;
}

export interface CategoryNoteFormData {
  title: string;
  text: string;
  icon_url?: string;
  categories: string[];
}
