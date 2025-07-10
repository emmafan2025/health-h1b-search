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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      green_card_priority_dates_action: {
        Row: {
          category: string | null
          china_current: string | null
          created_at: string
          global_current: string | null
          id: number
          india_current: string | null
          mexico_current: string | null
          philippines_current: string | null
        }
        Insert: {
          category?: string | null
          china_current?: string | null
          created_at?: string
          global_current?: string | null
          id?: number
          india_current?: string | null
          mexico_current?: string | null
          philippines_current?: string | null
        }
        Update: {
          category?: string | null
          china_current?: string | null
          created_at?: string
          global_current?: string | null
          id?: number
          india_current?: string | null
          mexico_current?: string | null
          philippines_current?: string | null
        }
        Relationships: []
      }
      green_card_priority_dates_filing: {
        Row: {
          category: string | null
          china_current: string | null
          global_current: string | null
          id: number
          india_current: string | null
          mexico_current: string | null
          philippines_current: string | null
        }
        Insert: {
          category?: string | null
          china_current?: string | null
          global_current?: string | null
          id?: number
          india_current?: string | null
          mexico_current?: string | null
          philippines_current?: string | null
        }
        Update: {
          category?: string | null
          china_current?: string | null
          global_current?: string | null
          id?: number
          india_current?: string | null
          mexico_current?: string | null
          philippines_current?: string | null
        }
        Relationships: []
      }
      healthcare_h1b_cases: {
        Row: {
          BEGIN_DATE: string | null
          CASE_NUMBER: string
          EMPLOYER_NAME: string | null
          END_DATE: string | null
          FULL_TIME_POSITION: string | null
          JOB_TITLE: string | null
          PW_WAGE_LEVEL: string | null
          Quarter: string | null
          record_id: string
          SOC_CODE: string | null
          SOC_TITLE: string | null
          TRADE_NAME_DBA: string | null
          WAGE_RATE_OF_PAY_FROM: number | null
          WAGE_RATE_OF_PAY_TO: number | null
          WAGE_UNIT_OF_PAY: string | null
          WORKSITE_ADDRESS1: string | null
          WORKSITE_CITY: string | null
          WORKSITE_COUNTY: string | null
          WORKSITE_POSTAL_CODE: string | null
          WORKSITE_STATE: string | null
          Year: number | null
        }
        Insert: {
          BEGIN_DATE?: string | null
          CASE_NUMBER: string
          EMPLOYER_NAME?: string | null
          END_DATE?: string | null
          FULL_TIME_POSITION?: string | null
          JOB_TITLE?: string | null
          PW_WAGE_LEVEL?: string | null
          Quarter?: string | null
          record_id?: string
          SOC_CODE?: string | null
          SOC_TITLE?: string | null
          TRADE_NAME_DBA?: string | null
          WAGE_RATE_OF_PAY_FROM?: number | null
          WAGE_RATE_OF_PAY_TO?: number | null
          WAGE_UNIT_OF_PAY?: string | null
          WORKSITE_ADDRESS1?: string | null
          WORKSITE_CITY?: string | null
          WORKSITE_COUNTY?: string | null
          WORKSITE_POSTAL_CODE?: string | null
          WORKSITE_STATE?: string | null
          Year?: number | null
        }
        Update: {
          BEGIN_DATE?: string | null
          CASE_NUMBER?: string
          EMPLOYER_NAME?: string | null
          END_DATE?: string | null
          FULL_TIME_POSITION?: string | null
          JOB_TITLE?: string | null
          PW_WAGE_LEVEL?: string | null
          Quarter?: string | null
          record_id?: string
          SOC_CODE?: string | null
          SOC_TITLE?: string | null
          TRADE_NAME_DBA?: string | null
          WAGE_RATE_OF_PAY_FROM?: number | null
          WAGE_RATE_OF_PAY_TO?: number | null
          WAGE_UNIT_OF_PAY?: string | null
          WORKSITE_ADDRESS1?: string | null
          WORKSITE_CITY?: string | null
          WORKSITE_COUNTY?: string | null
          WORKSITE_POSTAL_CODE?: string | null
          WORKSITE_STATE?: string | null
          Year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_years: {
        Args: Record<PropertyKey, never>
        Returns: {
          year: number
        }[]
      }
      get_employer_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          employer_name: string
          case_count: number
        }[]
      }
      get_employers_by_occupation_with_counts: {
        Args:
          | { occupation_title?: string }
          | { occupation_title?: string; filter_year?: number }
        Returns: {
          employer_name: string
          case_count: number
        }[]
      }
      get_occupation_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          occupation: string
          soc_code: string
          case_count: number
        }[]
      }
      get_state_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          state: string
          case_count: number
        }[]
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
    Enums: {},
  },
} as const
