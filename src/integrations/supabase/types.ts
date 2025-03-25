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
      ingredient_models: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          model_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          model_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          model_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_models_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredient_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          biodegradability: number | null
          created_at: string
          detergency: number | null
          foaming: number | null
          id: string
          name: string | null
          purity: number | null
        }
        Insert: {
          biodegradability?: number | null
          created_at?: string
          detergency?: number | null
          foaming?: number | null
          id?: string
          name?: string | null
          purity?: number | null
        }
        Update: {
          biodegradability?: number | null
          created_at?: string
          detergency?: number | null
          foaming?: number | null
          id?: string
          name?: string | null
          purity?: number | null
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string | null
          id: string
          name: string
          threshold_biodegrability: number | null
          threshold_detergency: number | null
          threshold_foaming: number | null
          threshold_purity: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          threshold_biodegrability?: number | null
          threshold_detergency?: number | null
          threshold_foaming?: number | null
          threshold_purity?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          threshold_biodegrability?: number | null
          threshold_detergency?: number | null
          threshold_foaming?: number | null
          threshold_purity?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          failed_batches: number | null
          passed_batches: number | null
          results: Json[] | null
          submission_label: string | null
          submissionid: string
          supplierid: string
          total_batches: number | null
        }
        Insert: {
          created_at?: string
          failed_batches?: number | null
          passed_batches?: number | null
          results?: Json[] | null
          submission_label?: string | null
          submissionid: string
          supplierid: string
          total_batches?: number | null
        }
        Update: {
          created_at?: string
          failed_batches?: number | null
          passed_batches?: number | null
          results?: Json[] | null
          submission_label?: string | null
          submissionid?: string
          supplierid?: string
          total_batches?: number | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          company_name: string
          created_at: string | null
          email: string | null
          id: string
          notification_email: string | null
          password_hash: string | null
          status: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          email?: string | null
          id?: string
          notification_email?: string | null
          password_hash?: string | null
          status?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          notification_email?: string | null
          password_hash?: string | null
          status?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
