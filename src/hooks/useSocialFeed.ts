import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface SocialPost {
  id: string;
  user_id: string;
  post_type: 'prediction' | 'template';
  prediction_id?: string;
  template_id?: string;
  caption?: string;
  likes_count: number;
  tails_count: number;
  total_tips: number;
  created_at: string;
  profile?: {
    display_name: string;
    email: string;
  };
  prediction?: {
    selections: any;
    amount: number;
    bet_type: string;
    status: string;
    result?: string;
  };
  template?: {
    name: string;
    description?: string;
    selections: any;
    bet_amount: number;
    bet_type: string;
  };
  user_liked?: boolean;
}

export const useSocialFeed = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['social-feed'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles!social_posts_user_id_fkey(display_name, email),
          predictions!social_posts_prediction_id_fkey(selections, amount, bet_type, status, result),
          bet_templates!social_posts_template_id_fkey(name, description, selections, bet_amount, bet_type)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("Failed to fetch social feed:", error);
        return [];
      }

      // Check if user liked each post
      if (user) {
        const { data: likes } = await supabase
          .from('social_post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
        
        return (data || []).map(post => ({
          ...post,
          profile: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
          prediction: Array.isArray(post.predictions) ? post.predictions[0] : post.predictions,
          template: Array.isArray(post.bet_templates) ? post.bet_templates[0] : post.bet_templates,
          user_liked: likedPostIds.has(post.id)
        })) as any;
      }

      return (data || []).map(post => ({
        ...post,
        profile: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
        prediction: Array.isArray(post.predictions) ? post.predictions[0] : post.predictions,
        template: Array.isArray(post.bet_templates) ? post.bet_templates[0] : post.bet_templates
      })) as any;
    }
  });

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const post = posts?.find(p => p.id === postId);
      
      if (post?.user_liked) {
        // Unlike
        const { error } = await supabase
          .from('social_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Decrement likes count
        await supabase
          .from('social_posts')
          .update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) })
          .eq('id', postId);
      } else {
        // Like
        const { error } = await supabase
          .from('social_post_likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;

        // Increment likes count
        await supabase
          .from('social_posts')
          .update({ likes_count: (post?.likes_count || 0) + 1 })
          .eq('id', postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    }
  });

  const sharePost = useMutation({
    mutationFn: async ({ 
      type, 
      predictionId, 
      templateId, 
      caption 
    }: { 
      type: 'prediction' | 'template'; 
      predictionId?: string; 
      templateId?: string; 
      caption?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          post_type: type,
          prediction_id: predictionId,
          template_id: templateId,
          caption
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
      toast.success("Post shared successfully!");
    },
    onError: (error) => {
      toast.error("Failed to share post");
      console.error("Share error:", error);
    }
  });

  return {
    posts,
    isLoading,
    toggleLike,
    sharePost
  };
};
