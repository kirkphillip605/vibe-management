export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          changed_at: string
          changed_by: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          created_at: string
          created_by: string
          customer_id: string
          id: string
          note: string
        }
        Insert: {
          created_at?: string
          created_by: string
          customer_id: string
          id?: string
          note: string
        }
        Update: {
          created_at?: string
          created_by?: string
          customer_id?: string
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_venues: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          venue_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_venues_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          billing_address: Json | null
          business_name: string | null
          created_at: string
          created_by: string | null
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          business_name?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          full_name: string
          id?: string
          phone: string
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          business_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      dj_documents: {
        Row: {
          created_at: string
          dj_id: string
          document_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          dj_id: string
          document_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          dj_id?: string
          document_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dj_documents_dj_id_fkey"
            columns: ["dj_id"]
            isOneToOne: false
            referencedRelation: "dj_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dj_profiles: {
        Row: {
          address: Json
          created_at: string
          dob: string
          email: string
          emergency_contacts: Json | null
          employment_status: Database["public"]["Enums"]["employment_status"]
          full_name: string
          id: string
          phone: string
          ssn_encrypted: string
          updated_at: string
        }
        Insert: {
          address: Json
          created_at?: string
          dob: string
          email: string
          emergency_contacts?: Json | null
          employment_status: Database["public"]["Enums"]["employment_status"]
          full_name: string
          id: string
          phone: string
          ssn_encrypted: string
          updated_at?: string
        }
        Update: {
          address?: Json
          created_at?: string
          dob?: string
          email?: string
          emergency_contacts?: Json | null
          employment_status?: Database["public"]["Enums"]["employment_status"]
          full_name?: string
          id?: string
          phone?: string
          ssn_encrypted?: string
          updated_at?: string
        }
        Relationships: []
      }
      gig_assignments: {
        Row: {
          created_at: string
          dj_id: string
          gig_id: string
          id: string
          pay_rate: number
          pay_type: Database["public"]["Enums"]["pay_type"]
          total_payout: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dj_id: string
          gig_id: string
          id?: string
          pay_rate: number
          pay_type?: Database["public"]["Enums"]["pay_type"]
          total_payout: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dj_id?: string
          gig_id?: string
          id?: string
          pay_rate?: number
          pay_type?: Database["public"]["Enums"]["pay_type"]
          total_payout?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gig_assignments_dj_id_fkey"
            columns: ["dj_id"]
            isOneToOne: false
            referencedRelation: "dj_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gig_assignments_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      gigs: {
        Row: {
          amount_received: number | null
          created_at: string
          created_by: string | null
          customer_id: string
          end_datetime: string
          frequency: Database["public"]["Enums"]["gig_frequency"] | null
          id: string
          invoiced_amount: number | null
          is_recurring: boolean | null
          parent_gig_id: string | null
          quoted_amount: number
          recurrence_count: number | null
          recurrence_end_date: string | null
          start_datetime: string
          status: Database["public"]["Enums"]["gig_status"]
          updated_at: string
          venue_id: string
        }
        Insert: {
          amount_received?: number | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          end_datetime: string
          frequency?: Database["public"]["Enums"]["gig_frequency"] | null
          id?: string
          invoiced_amount?: number | null
          is_recurring?: boolean | null
          parent_gig_id?: string | null
          quoted_amount: number
          recurrence_count?: number | null
          recurrence_end_date?: string | null
          start_datetime: string
          status?: Database["public"]["Enums"]["gig_status"]
          updated_at?: string
          venue_id: string
        }
        Update: {
          amount_received?: number | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          end_datetime?: string
          frequency?: Database["public"]["Enums"]["gig_frequency"] | null
          id?: string
          invoiced_amount?: number | null
          is_recurring?: boolean | null
          parent_gig_id?: string | null
          quoted_amount?: number
          recurrence_count?: number | null
          recurrence_end_date?: string | null
          start_datetime?: string
          status?: Database["public"]["Enums"]["gig_status"]
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gigs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigs_parent_gig_id_fkey"
            columns: ["parent_gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigs_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
      venue_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: Json
          created_at: string
          created_by: string | null
          id: string
          name: string
          updated_at: string
          venue_type_id: string | null
        }
        Insert: {
          address: Json
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string
          venue_type_id?: string | null
        }
        Update: {
          address?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string
          venue_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_venue_type_id_fkey"
            columns: ["venue_type_id"]
            isOneToOne: false
            referencedRelation: "venue_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "dj"
      employment_status: "employee" | "contractor" | "1099"
      gig_frequency: "weekly" | "bi-weekly" | "monthly"
      gig_status:
        | "draft"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "canceled"
      pay_type: "flat" | "hourly" | "percentage"
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
      app_role: ["admin", "dj"],
      employment_status: ["employee", "contractor", "1099"],
      gig_frequency: ["weekly", "bi-weekly", "monthly"],
      gig_status: [
        "draft",
        "scheduled",
        "in_progress",
        "completed",
        "canceled",
      ],
      pay_type: ["flat", "hourly", "percentage"],
    },
  },
} as const
