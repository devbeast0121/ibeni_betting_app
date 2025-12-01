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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_deletions: {
        Row: {
          account_age_days: number | null
          completed_at: string | null
          created_at: string | null
          deletion_reason: string | null
          email: string
          final_withdrawal_amount: number | null
          growth_cash_balance: number | null
          id: string
          portfolio_balance: number | null
          processed_at: string | null
          status: string | null
          stripe_transfer_id: string | null
          user_id: string
          withdrawal_fees_applied: number | null
          withdrawal_processed: boolean | null
        }
        Insert: {
          account_age_days?: number | null
          completed_at?: string | null
          created_at?: string | null
          deletion_reason?: string | null
          email: string
          final_withdrawal_amount?: number | null
          growth_cash_balance?: number | null
          id?: string
          portfolio_balance?: number | null
          processed_at?: string | null
          status?: string | null
          stripe_transfer_id?: string | null
          user_id: string
          withdrawal_fees_applied?: number | null
          withdrawal_processed?: boolean | null
        }
        Update: {
          account_age_days?: number | null
          completed_at?: string | null
          created_at?: string | null
          deletion_reason?: string | null
          email?: string
          final_withdrawal_amount?: number | null
          growth_cash_balance?: number | null
          id?: string
          portfolio_balance?: number | null
          processed_at?: string | null
          status?: string | null
          stripe_transfer_id?: string | null
          user_id?: string
          withdrawal_fees_applied?: number | null
          withdrawal_processed?: boolean | null
        }
        Relationships: []
      }
      ach_transfers: {
        Row: {
          amount: number
          created_at: string
          failure_reason: string | null
          id: string
          plaid_account_id: string
          plaid_transfer_id: string | null
          status: string
          transfer_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          failure_reason?: string | null
          id?: string
          plaid_account_id: string
          plaid_transfer_id?: string | null
          status?: string
          transfer_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          failure_reason?: string | null
          id?: string
          plaid_account_id?: string
          plaid_transfer_id?: string | null
          status?: string
          transfer_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ach_transfers_plaid_account_id_fkey"
            columns: ["plaid_account_id"]
            isOneToOne: false
            referencedRelation: "plaid_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_betting_settings: {
        Row: {
          bet_multiplier: number
          created_at: string
          follow_user_id: string | null
          id: string
          is_enabled: boolean
          max_bet_amount: number
          max_odds: number | null
          min_odds: number | null
          sports_filter: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bet_multiplier?: number
          created_at?: string
          follow_user_id?: string | null
          id?: string
          is_enabled?: boolean
          max_bet_amount?: number
          max_odds?: number | null
          min_odds?: number | null
          sports_filter?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bet_multiplier?: number
          created_at?: string
          follow_user_id?: string | null
          id?: string
          is_enabled?: boolean
          max_bet_amount?: number
          max_odds?: number | null
          min_odds?: number | null
          sports_filter?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bet_templates: {
        Row: {
          bet_amount: number
          bet_type: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          selections: Json
          times_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bet_amount: number
          bet_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          selections: Json
          times_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bet_amount?: number
          bet_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          selections?: Json
          times_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      betting_analytics: {
        Row: {
          created_at: string
          date: string
          favorite_sport: string | null
          id: string
          longest_loss_streak: number
          longest_win_streak: number
          roi: number
          total_bets: number
          total_wagered: number
          total_winnings: number
          updated_at: string
          user_id: string
          win_rate: number
        }
        Insert: {
          created_at?: string
          date: string
          favorite_sport?: string | null
          id?: string
          longest_loss_streak?: number
          longest_win_streak?: number
          roi?: number
          total_bets?: number
          total_wagered?: number
          total_winnings?: number
          updated_at?: string
          user_id: string
          win_rate?: number
        }
        Update: {
          created_at?: string
          date?: string
          favorite_sport?: string | null
          id?: string
          longest_loss_streak?: number
          longest_win_streak?: number
          roi?: number
          total_bets?: number
          total_wagered?: number
          total_winnings?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
        }
        Relationships: []
      }
      bonus_bet_awards: {
        Row: {
          amount: number
          award_period: string
          awarded_at: string
          created_at: string
          id: string
          subscription_tier: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          award_period: string
          awarded_at?: string
          created_at?: string
          id?: string
          subscription_tier?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          award_period?: string
          awarded_at?: string
          created_at?: string
          id?: string
          subscription_tier?: string | null
          user_id?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount: number
          created_at: string
          deposit_type: string
          id: string
          payment_method: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          deposit_type?: string
          id?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          deposit_type?: string
          id?: string
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expert_traders: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          followers_count: number
          id: string
          is_verified: boolean
          subscription_fee: number
          total_profit: number
          updated_at: string
          user_id: string
          win_rate: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          followers_count?: number
          id?: string
          is_verified?: boolean
          subscription_fee?: number
          total_profit?: number
          updated_at?: string
          user_id: string
          win_rate?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          followers_count?: number
          id?: string
          is_verified?: boolean
          subscription_fee?: number
          total_profit?: number
          updated_at?: string
          user_id?: string
          win_rate?: number
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string
          document_type: string
          document_url: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          is_read: boolean
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_read?: boolean
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plaid_accounts: {
        Row: {
          account_id: string
          account_name: string | null
          account_subtype: string | null
          account_type: string | null
          created_at: string
          id: string
          is_active: boolean
          plaid_access_token: string
          plaid_item_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          account_name?: string | null
          account_subtype?: string | null
          account_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          plaid_access_token: string
          plaid_item_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          account_name?: string | null
          account_subtype?: string | null
          account_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          plaid_access_token?: string
          plaid_item_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_fees: {
        Row: {
          amount: number
          bet_id: string
          created_at: string
          id: string
        }
        Insert: {
          amount: number
          bet_id: string
          created_at?: string
          id?: string
        }
        Update: {
          amount?: number
          bet_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          amount: number
          bet_type: string
          created_at: string
          id: string
          platform_fee: number | null
          result: string | null
          selections: Json
          status: string
          updated_at: string
          user_id: string
          winnings: number | null
        }
        Insert: {
          amount: number
          bet_type: string
          created_at?: string
          id?: string
          platform_fee?: number | null
          result?: string | null
          selections: Json
          status?: string
          updated_at?: string
          user_id: string
          winnings?: number | null
        }
        Update: {
          amount?: number
          bet_type?: string
          created_at?: string
          id?: string
          platform_fee?: number | null
          result?: string | null
          selections?: Json
          status?: string
          updated_at?: string
          user_id?: string
          winnings?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restricted_states: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          reason: string | null
          state_code: string
          state_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          state_code: string
          state_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          state_code?: string
          state_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          likes_count: number
          post_type: string
          prediction_id: string | null
          tails_count: number
          template_id: string | null
          total_tips: number
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          likes_count?: number
          post_type: string
          prediction_id?: string | null
          tails_count?: number
          template_id?: string | null
          total_tips?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          likes_count?: number
          post_type?: string
          prediction_id?: string | null
          tails_count?: number
          template_id?: string | null
          total_tips?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "bet_templates"
            referencedColumns: ["id"]
          },
        ]
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
      tips: {
        Row: {
          amount: number
          created_at: string
          id: string
          post_id: string
          processed_at: string | null
          receiver_user_id: string
          status: string
          tipper_user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          post_id: string
          processed_at?: string | null
          receiver_user_id: string
          status?: string
          tipper_user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          post_id?: string
          processed_at?: string | null
          receiver_user_id?: string
          status?: string
          tipper_user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          available_balance: number
          bonus_bets: number | null
          created_at: string
          growth_cash: number
          id: string
          invested_balance: number
          pending_withdrawal: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available_balance?: number
          bonus_bets?: number | null
          created_at?: string
          growth_cash?: number
          id?: string
          invested_balance?: number
          pending_withdrawal?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available_balance?: number
          bonus_bets?: number | null
          created_at?: string
          growth_cash?: number
          id?: string
          invested_balance?: number
          pending_withdrawal?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string | null
          detected_at: string | null
          id: string
          ip_address: unknown
          is_restricted: boolean | null
          state_code: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string
          ip_address?: unknown
          is_restricted?: boolean | null
          state_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          detected_at?: string | null
          id?: string
          ip_address?: unknown
          is_restricted?: boolean | null
          state_code?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_premium_bonus_bets: { Args: never; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      process_pending_tips: { Args: never; Returns: undefined }
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
