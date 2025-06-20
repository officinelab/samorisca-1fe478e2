export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          title: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          title_en: string | null
          title_fr: string | null
          title_es: string | null
          title_de: string | null
          description_en: string | null
          description_fr: string | null
          description_es: string | null
          description_de: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_es?: string | null
          description_de?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_es?: string | null
          description_de?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number | null
          category_id: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          title_en: string | null
          title_fr: string | null
          title_es: string | null
          title_de: string | null
          description_en: string | null
          description_fr: string | null
          description_es: string | null
          description_de: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number | null
          category_id: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_es?: string | null
          description_de?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number | null
          category_id?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_es?: string | null
          description_de?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      allergens: {
        Row: {
          id: string
          title: string
          description: string | null
          number: number
          icon_url: string | null
          display_order: number
          created_at: string
          updated_at: string
          title_en: string | null
          title_fr: string | null
          title_es: string | null
          title_de: string | null
          description_en: string | null
          description_fr: string | null
          description_es: string | null
          description_de: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          number: number
          icon_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_es?: string | null
          description_de?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          number?: number
          icon_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_es?: string | null
          description_de?: string | null
        }
        Relationships: []
      }
      product_features: {
        Row: {
          id: string
          title: string
          icon_url: string | null
          display_order: number
          created_at: string
          updated_at: string
          title_en: string | null
          title_fr: string | null
          title_es: string | null
          title_de: string | null
        }
        Insert: {
          id?: string
          title: string
          icon_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
        }
        Update: {
          id?: string
          title?: string
          icon_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
          title_en?: string | null
          title_fr?: string | null
          title_es?: string | null
          title_de?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type Category = Tables<'categories'>;
export type Product = Tables<'products'>;
export type Allergen = Tables<'allergens'>;

export interface ProductFeature {
  id: string;
  title: string;
  icon_url?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  title_en?: string;
  title_fr?: string;
  title_es?: string;
  title_de?: string;
}
