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
      healthcare_h1b_cases: {
        Row: {
          BEGIN_DATE: string | null
          CASE_NUMBER: string | null
          created_at: string
          EMPLOYER_NAME: string | null
          END_DATE: string | null
          FULL_TIME_POSITION: boolean | null
          id: number
          JOB_TITLE: string | null
          PW_WAGE_LEVEL: string | null
          Quarter: string | null
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
          CASE_NUMBER?: string | null
          created_at?: string
          EMPLOYER_NAME?: string | null
          END_DATE?: string | null
          FULL_TIME_POSITION?: boolean | null
          id?: number
          JOB_TITLE?: string | null
          PW_WAGE_LEVEL?: string | null
          Quarter?: string | null
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
          CASE_NUMBER?: string | null
          created_at?: string
          EMPLOYER_NAME?: string | null
          END_DATE?: string | null
          FULL_TIME_POSITION?: boolean | null
          id?: number
          JOB_TITLE?: string | null
          PW_WAGE_LEVEL?: string | null
          Quarter?: string | null
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
