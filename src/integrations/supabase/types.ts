export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      crop_diseases: {
        Row: {
          created_at: string
          crop_id: string
          disease_id: string
          id: string
          notes: string | null
          susceptibility: string | null
        }
        Insert: {
          created_at?: string
          crop_id: string
          disease_id: string
          id?: string
          notes?: string | null
          susceptibility?: string | null
        }
        Update: {
          created_at?: string
          crop_id?: string
          disease_id?: string
          id?: string
          notes?: string | null
          susceptibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_diseases_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_diseases_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_images: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          crop_id: string
          description: string | null
          id: string
          image_type: string
          image_url: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          crop_id: string
          description?: string | null
          id?: string
          image_type: string
          image_url: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          crop_id?: string
          description?: string | null
          id?: string
          image_type?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_images_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_search_vectors: {
        Row: {
          content: string
          content_type: string
          created_at: string
          crop_id: string | null
          disease_id: string | null
          embedding_data: Json | null
          id: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          crop_id?: string | null
          disease_id?: string | null
          embedding_data?: Json | null
          id?: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          crop_id?: string | null
          disease_id?: string | null
          embedding_data?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_search_vectors_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_search_vectors_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          growing_conditions: Json | null
          harvest_season: string | null
          id: string
          market_info: Json | null
          name: string
          nutrition_info: Json | null
          planting_season: string | null
          scientific_name: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          growing_conditions?: Json | null
          harvest_season?: string | null
          id?: string
          market_info?: Json | null
          name: string
          nutrition_info?: Json | null
          planting_season?: string | null
          scientific_name?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          growing_conditions?: Json | null
          harvest_season?: string | null
          id?: string
          market_info?: Json | null
          name?: string
          nutrition_info?: Json | null
          planting_season?: string | null
          scientific_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      diseases: {
        Row: {
          causes: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          prevention: string | null
          scientific_name: string | null
          severity: string | null
          symptoms: string | null
          treatment: string | null
          updated_at: string
        }
        Insert: {
          causes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          prevention?: string | null
          scientific_name?: string | null
          severity?: string | null
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
        }
        Update: {
          causes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          prevention?: string | null
          scientific_name?: string | null
          severity?: string | null
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          audio_language: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          farm_size_hectares: number | null
          farming_experience: string | null
          full_name: string | null
          id: string
          location_coordinates: unknown | null
          notification_preferences: Json | null
          phone_number: string | null
          preferred_language: string | null
          primary_crops: string[] | null
          region: string | null
          role: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          audio_language?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          farm_size_hectares?: number | null
          farming_experience?: string | null
          full_name?: string | null
          id: string
          location_coordinates?: unknown | null
          notification_preferences?: Json | null
          phone_number?: string | null
          preferred_language?: string | null
          primary_crops?: string[] | null
          region?: string | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          audio_language?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          farm_size_hectares?: number | null
          farming_experience?: string | null
          full_name?: string | null
          id?: string
          location_coordinates?: unknown | null
          notification_preferences?: Json | null
          phone_number?: string | null
          preferred_language?: string | null
          primary_crops?: string[] | null
          region?: string | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scans: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          diagnosis_result: Json | null
          id: string
          image_url: string | null
          issue_detected: string | null
          location: string | null
          notes: string | null
          plant_type: string | null
          recommendations: string | null
          severity: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          diagnosis_result?: Json | null
          id?: string
          image_url?: string | null
          issue_detected?: string | null
          location?: string | null
          notes?: string | null
          plant_type?: string | null
          recommendations?: string | null
          severity?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          diagnosis_result?: Json | null
          id?: string
          image_url?: string | null
          issue_detected?: string | null
          location?: string | null
          notes?: string | null
          plant_type?: string | null
          recommendations?: string | null
          severity?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
