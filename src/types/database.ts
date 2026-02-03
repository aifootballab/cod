// ============================================
// SUPABASE DATABASE TYPES
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          email: string | null;
          rank: string;
          rank_points: number;
          total_analyses: number;
          favorite_weapon: string | null;
          playstyle: string;
          subscription_tier: string;
          subscription_expires_at: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          rank?: string;
          rank_points?: number;
          total_analyses?: number;
          favorite_weapon?: string | null;
          playstyle?: string;
          subscription_tier?: string;
          subscription_expires_at?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          rank?: string;
          rank_points?: number;
          total_analyses?: number;
          favorite_weapon?: string | null;
          playstyle?: string;
          subscription_tier?: string;
          subscription_expires_at?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          screenshot_url: string | null;
          status: string;
          kd_ratio: number | null;
          accuracy: number | null;
          spm: number | null;
          win_rate: number | null;
          total_kills: number | null;
          total_deaths: number | null;
          headshot_percent: number | null;
          play_time_hours: number | null;
          best_weapon: string | null;
          level: number | null;
          playstyle_detected: string | null;
          recommended_builds: Json | null;
          ai_analysis: string | null;
          tips: Json | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          screenshot_url?: string | null;
          status?: string;
          kd_ratio?: number | null;
          accuracy?: number | null;
          spm?: number | null;
          win_rate?: number | null;
          total_kills?: number | null;
          total_deaths?: number | null;
          headshot_percent?: number | null;
          play_time_hours?: number | null;
          best_weapon?: string | null;
          level?: number | null;
          playstyle_detected?: string | null;
          recommended_builds?: Json | null;
          ai_analysis?: string | null;
          tips?: Json | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          screenshot_url?: string | null;
          status?: string;
          kd_ratio?: number | null;
          accuracy?: number | null;
          spm?: number | null;
          win_rate?: number | null;
          total_kills?: number | null;
          total_deaths?: number | null;
          headshot_percent?: number | null;
          play_time_hours?: number | null;
          best_weapon?: string | null;
          level?: number | null;
          playstyle_detected?: string | null;
          recommended_builds?: Json | null;
          ai_analysis?: string | null;
          tips?: Json | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      weapon_builds: {
        Row: {
          id: string;
          weapon_name: string;
          build_name: string;
          description: string | null;
          category: string | null;
          game_version: string;
          stat_damage: number | null;
          stat_accuracy: number | null;
          stat_range: number | null;
          stat_fire_rate: number | null;
          stat_mobility: number | null;
          stat_control: number | null;
          attachments: Json | null;
          pros: Json | null;
          cons: Json | null;
          is_meta: boolean;
          is_official: boolean;
          difficulty: string | null;
          recommended_kd_min: number | null;
          recommended_kd_max: number | null;
          recommended_accuracy_min: number | null;
          recommended_accuracy_max: number | null;
          recommended_playstyles: Json | null;
          likes_count: number;
          usage_count: number;
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Functions: {
      search_builds_by_embedding: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          weapon_name: string;
          build_name: string;
          description: string;
          similarity: number;
        }[];
      };
      calculate_user_rank: {
        Args: {
          user_kd: number;
          user_accuracy: number;
        };
        Returns: string;
      };
      increment_build_usage: {
        Args: { build_id: string };
        Returns: void;
      };
      get_leaderboard: {
        Args: {
          period_type: string;
          limit_count: number;
        };
        Returns: {
          rank: number;
          user_id: string;
          username: string;
          rank_tier: string;
          kd_ratio: number;
          accuracy: number;
          spm: number;
          total_score: number;
        }[];
      };
    };
  };
}
