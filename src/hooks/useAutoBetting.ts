import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface AutoBettingSettings {
  id: string;
  user_id: string;
  is_enabled: boolean;
  follow_user_id?: string;
  max_bet_amount: number;
  bet_multiplier: number;
  sports_filter: string[];
  min_odds: number;
  max_odds: number;
}

export interface ExpertTrader {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  is_verified: boolean;
  followers_count: number;
  win_rate: number;
  total_profit: number;
  subscription_fee: number;
}

export const useAutoBetting = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['auto-betting-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('auto_betting_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch auto betting settings:", error);
        return null;
      }

      return data as AutoBettingSettings | null;
    }
  });

  const { data: expertTraders, isLoading: expertsLoading } = useQuery({
    queryKey: ['expert-traders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_traders')
        .select('*')
        .order('win_rate', { ascending: false });

      if (error) {
        console.error("Failed to fetch expert traders:", error);
        return [];
      }

      return data as ExpertTrader[];
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<AutoBettingSettings>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('auto_betting_settings')
        .upsert({
          user_id: user.id,
          ...newSettings
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-betting-settings'] });
      toast.success("Auto betting settings updated!");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error("Auto betting update error:", error);
    }
  });

  const becomeExpert = useMutation({
    mutationFn: async ({ displayName, bio }: { displayName: string; bio?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('expert_traders')
        .insert({
          user_id: user.id,
          display_name: displayName,
          bio
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expert-traders'] });
      toast.success("Expert trader profile created!");
    },
    onError: (error) => {
      toast.error("Failed to create expert profile");
      console.error("Expert creation error:", error);
    }
  });

  return {
    settings,
    expertTraders,
    isLoading: settingsLoading || expertsLoading,
    updateSettings,
    becomeExpert
  };
};