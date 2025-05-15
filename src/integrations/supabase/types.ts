export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergens: {
        Row: {
          created_at: string | null
          description: string | null
          description_de: string | null
          description_en: string | null
          description_es: string | null
          description_fr: string | null
          display_order: number
          icon_url: string | null
          id: string
          number: number
          title: string
          title_de: string | null
          title_en: string | null
          title_es: string | null
          title_fr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          display_order?: number
          icon_url?: string | null
          id?: string
          number: number
          title: string
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          display_order?: number
          icon_url?: string | null
          id?: string
          number?: number
          title?: string
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      print_layouts: {
        Row: {
          allergens: Json
          cover: Json
          created_at: string
          elements: Json
          id: string
          is_default: boolean
          name: string
          page: Json
          product_schema: string
          spacing: Json
          type: string
          updated_at: string
        }
        Insert: {
          allergens: Json
          cover: Json
          created_at?: string
          elements: Json
          id?: string
          is_default?: boolean
          name: string
          page: Json
          product_schema: string
          spacing: Json
          type: string
          updated_at?: string
        }
        Update: {
          allergens?: Json
          cover?: Json
          created_at?: string
          elements?: Json
          id?: string
          is_default?: boolean
          name?: string
          page?: Json
          product_schema?: string
          spacing?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_allergens: {
        Row: {
          allergen_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          allergen_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          allergen_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_allergens_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_features: {
        Row: {
          created_at: string | null
          display_order: number
          icon_url: string | null
          id: string
          title: string
          title_de: string | null
          title_en: string | null
          title_es: string | null
          title_fr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          icon_url?: string | null
          id?: string
          title: string
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          icon_url?: string | null
          id?: string
          title?: string
          title_de?: string | null
          title_en?: string | null
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_labels: {
        Row: {
          color: string | null
          created_at: string | null
          display_order: number
          id: string
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_prices: {
        Row: {
          display_order: number
          id: string
          name: string | null
          price: number
          product_id: string | null
        }
        Insert: {
          display_order?: number
          id?: string
          name?: string | null
          price: number
          product_id?: string | null
        }
        Update: {
          display_order?: number
          id?: string
          name?: string | null
          price?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_to_features: {
        Row: {
          feature_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          feature_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          feature_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_to_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "product_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_to_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number
          has_multiple_prices: boolean | null
          has_price_suffix: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          label_id: string | null
          price_standard: number | null
          price_suffix: string | null
          price_variant_1_name: string | null
          price_variant_1_value: number | null
          price_variant_2_name: string | null
          price_variant_2_value: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          has_multiple_prices?: boolean | null
          has_price_suffix?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          label_id?: string | null
          price_standard?: number | null
          price_suffix?: string | null
          price_variant_1_name?: string | null
          price_variant_1_value?: number | null
          price_variant_2_name?: string | null
          price_variant_2_value?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          has_multiple_prices?: boolean | null
          has_price_suffix?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          label_id?: string | null
          price_standard?: number | null
          price_suffix?: string | null
          price_variant_1_name?: string | null
          price_variant_1_value?: number | null
          price_variant_2_name?: string | null
          price_variant_2_value?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "product_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      translation_tokens: {
        Row: {
          created_at: string | null
          id: string
          last_updated: string | null
          month: string
          tokens_limit: number | null
          tokens_used: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          month: string
          tokens_limit?: number | null
          tokens_used?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          month?: string
          tokens_limit?: number | null
          tokens_used?: number | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          field: string
          id: string
          language: string
          last_updated: string | null
          original_text: string | null
          translated_text: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          field: string
          id?: string
          language: string
          last_updated?: string | null
          original_text?: string | null
          translated_text?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          field?: string
          id?: string
          language?: string
          last_updated?: string | null
          original_text?: string | null
          translated_text?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_month: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_remaining_tokens: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      increment_tokens: {
        Args: { token_count: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
