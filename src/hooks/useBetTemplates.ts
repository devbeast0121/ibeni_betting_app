import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface BetTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  selections: any;
  bet_amount: number;
  bet_type: string;
  is_public: boolean;
  times_used: number;
  created_at: string;
}

export const useBetTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['bet-templates'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bet_templates')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Failed to fetch bet templates:", error);
        return [];
      }

      return data as BetTemplate[];
    }
  });

  const saveTemplate = useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      selections, 
      betAmount, 
      betType, 
      isPublic 
    }: { 
      name: string; 
      description?: string; 
      selections: any; 
      betAmount: number; 
      betType: string; 
      isPublic: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('bet_templates')
        .insert({
          user_id: user.id,
          name,
          description,
          selections,
          bet_amount: betAmount,
          bet_type: betType,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bet-templates'] });
      toast.success("Bet template saved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to save bet template");
      console.error("Template save error:", error);
    }
  });

  const useTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { data, error } = await supabase
        .from('bet_templates')
        .update({ times_used: (templates?.find(t => t.id === templateId)?.times_used || 0) + 1 })
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bet-templates'] });
    }
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('bet_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bet-templates'] });
      toast.success("Template deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete template");
      console.error("Template delete error:", error);
    }
  });

  return {
    templates,
    isLoading,
    saveTemplate,
    useTemplate,
    deleteTemplate
  };
};