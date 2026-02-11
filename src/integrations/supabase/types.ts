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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      forum_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
          views: number
        }
        Insert: {
          author_name: string
          category?: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
          views?: number
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      green_card_perm_cases: {
        Row: {
          case_number: string | null
          case_status: string | null
          created_at: string | null
          decision_date: string | null
          emp_decl_title: string | null
          emp_info_decl_name: string | null
          emp_year_commenced_business: number | null
          employer_address_1: string | null
          employer_address_2: string | null
          employer_city: string | null
          employer_completed_application: string | null
          employer_country: string | null
          employer_name: string | null
          employer_num_employees: number | null
          employer_phone: string | null
          employer_phone_ext: string | null
          employer_postal_code: string | null
          employer_state_province: string | null
          first_advertisement_start_date: string | null
          first_newspaper_name: string | null
          foreign_worker_alt_ed_exp: string | null
          foreign_worker_alt_occ_exp: string | null
          foreign_worker_curr_employed: string | null
          foreign_worker_ed_inst_country: string | null
          foreign_worker_ed_inst_post_cd: string | null
          foreign_worker_empl_pay_for_ed: string | null
          foreign_worker_exp_with_empl: string | null
          foreign_worker_req_experience: string | null
          foreign_worker_training_comp: string | null
          job_title: string | null
          minimum_education: string | null
          preparer_email: string | null
          preparer_name: string | null
          preparer_title: string | null
          pw_determination_date: string | null
          pw_expiration_date: string | null
          pw_skill_level: string | null
          pw_soc_code: string | null
          pw_soc_title: string | null
          pw_track_number: string | null
          pw_unit_of_pay: string | null
          pw_wage: number | null
          pw_wage_source: string | null
          received_date: string | null
          record_id: string
          second_ad_start_date: string | null
          second_advertisement_type: string | null
          second_newspaper_ad_name: string | null
          specific_skills: string | null
          sunday_edition_newspaper: string | null
          swa_job_order_end_date: string | null
          swa_job_order_start_date: string | null
          wage_offer_from: number | null
          wage_offer_to: number | null
          wage_offer_unit_of_pay: string | null
          worksite_address_1: string | null
          worksite_address_2: string | null
          worksite_city: string | null
          worksite_postal_code: string | null
          worksite_state: string | null
        }
        Insert: {
          case_number?: string | null
          case_status?: string | null
          created_at?: string | null
          decision_date?: string | null
          emp_decl_title?: string | null
          emp_info_decl_name?: string | null
          emp_year_commenced_business?: number | null
          employer_address_1?: string | null
          employer_address_2?: string | null
          employer_city?: string | null
          employer_completed_application?: string | null
          employer_country?: string | null
          employer_name?: string | null
          employer_num_employees?: number | null
          employer_phone?: string | null
          employer_phone_ext?: string | null
          employer_postal_code?: string | null
          employer_state_province?: string | null
          first_advertisement_start_date?: string | null
          first_newspaper_name?: string | null
          foreign_worker_alt_ed_exp?: string | null
          foreign_worker_alt_occ_exp?: string | null
          foreign_worker_curr_employed?: string | null
          foreign_worker_ed_inst_country?: string | null
          foreign_worker_ed_inst_post_cd?: string | null
          foreign_worker_empl_pay_for_ed?: string | null
          foreign_worker_exp_with_empl?: string | null
          foreign_worker_req_experience?: string | null
          foreign_worker_training_comp?: string | null
          job_title?: string | null
          minimum_education?: string | null
          preparer_email?: string | null
          preparer_name?: string | null
          preparer_title?: string | null
          pw_determination_date?: string | null
          pw_expiration_date?: string | null
          pw_skill_level?: string | null
          pw_soc_code?: string | null
          pw_soc_title?: string | null
          pw_track_number?: string | null
          pw_unit_of_pay?: string | null
          pw_wage?: number | null
          pw_wage_source?: string | null
          received_date?: string | null
          record_id?: string
          second_ad_start_date?: string | null
          second_advertisement_type?: string | null
          second_newspaper_ad_name?: string | null
          specific_skills?: string | null
          sunday_edition_newspaper?: string | null
          swa_job_order_end_date?: string | null
          swa_job_order_start_date?: string | null
          wage_offer_from?: number | null
          wage_offer_to?: number | null
          wage_offer_unit_of_pay?: string | null
          worksite_address_1?: string | null
          worksite_address_2?: string | null
          worksite_city?: string | null
          worksite_postal_code?: string | null
          worksite_state?: string | null
        }
        Update: {
          case_number?: string | null
          case_status?: string | null
          created_at?: string | null
          decision_date?: string | null
          emp_decl_title?: string | null
          emp_info_decl_name?: string | null
          emp_year_commenced_business?: number | null
          employer_address_1?: string | null
          employer_address_2?: string | null
          employer_city?: string | null
          employer_completed_application?: string | null
          employer_country?: string | null
          employer_name?: string | null
          employer_num_employees?: number | null
          employer_phone?: string | null
          employer_phone_ext?: string | null
          employer_postal_code?: string | null
          employer_state_province?: string | null
          first_advertisement_start_date?: string | null
          first_newspaper_name?: string | null
          foreign_worker_alt_ed_exp?: string | null
          foreign_worker_alt_occ_exp?: string | null
          foreign_worker_curr_employed?: string | null
          foreign_worker_ed_inst_country?: string | null
          foreign_worker_ed_inst_post_cd?: string | null
          foreign_worker_empl_pay_for_ed?: string | null
          foreign_worker_exp_with_empl?: string | null
          foreign_worker_req_experience?: string | null
          foreign_worker_training_comp?: string | null
          job_title?: string | null
          minimum_education?: string | null
          preparer_email?: string | null
          preparer_name?: string | null
          preparer_title?: string | null
          pw_determination_date?: string | null
          pw_expiration_date?: string | null
          pw_skill_level?: string | null
          pw_soc_code?: string | null
          pw_soc_title?: string | null
          pw_track_number?: string | null
          pw_unit_of_pay?: string | null
          pw_wage?: number | null
          pw_wage_source?: string | null
          received_date?: string | null
          record_id?: string
          second_ad_start_date?: string | null
          second_advertisement_type?: string | null
          second_newspaper_ad_name?: string | null
          specific_skills?: string | null
          sunday_edition_newspaper?: string | null
          swa_job_order_end_date?: string | null
          swa_job_order_start_date?: string | null
          wage_offer_from?: number | null
          wage_offer_to?: number | null
          wage_offer_unit_of_pay?: string | null
          worksite_address_1?: string | null
          worksite_address_2?: string | null
          worksite_city?: string | null
          worksite_postal_code?: string | null
          worksite_state?: string | null
        }
        Relationships: []
      }
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      visa_sync_metadata: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: number
          last_sync_at: string | null
          records_updated: number | null
          source_url: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: number
          last_sync_at?: string | null
          records_updated?: number | null
          source_url?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: number
          last_sync_at?: string | null
          records_updated?: number | null
          source_url?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_years: {
        Args: never
        Returns: {
          year: number
        }[]
      }
      get_employer_counts: {
        Args: never
        Returns: {
          case_count: number
          employer_name: string
        }[]
      }
      get_employers_by_occupation_with_counts:
        | {
            Args: { occupation_title?: string }
            Returns: {
              case_count: number
              employer_name: string
            }[]
          }
        | {
            Args: { filter_year?: number; occupation_title?: string }
            Returns: {
              case_count: number
              employer_name: string
            }[]
          }
      get_forum_posts_with_reply_counts: {
        Args: never
        Returns: {
          author_name: string
          category: string
          content: string
          created_at: string
          id: string
          reply_count: number
          title: string
          updated_at: string
          views: number
        }[]
      }
      get_occupation_counts: {
        Args: never
        Returns: {
          case_count: number
          occupation: string
          soc_code: string
        }[]
      }
      get_state_counts: {
        Args: never
        Returns: {
          case_count: number
          state: string
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
