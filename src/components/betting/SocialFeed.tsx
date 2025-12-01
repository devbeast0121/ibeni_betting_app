import { useState } from "react";
import { useSocialFeed } from "@/hooks/useSocialFeed";
import { SocialPostCard } from "./SocialPostCard";
import { TipDialog } from "./TipDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { BetSlipItem } from "@/types/betting";
import { Users } from "lucide-react";
import { useTipping } from "@/hooks/useTipping";

interface SocialFeedProps {
  onLoadTail: (selections: any[], betAmount: number, betType: string) => void;
  onSaveTemplate: (selections: any[], betAmount: number, betType: string, name: string, description?: string) => void;
}

const mockPosts = [
  {
    id: 'mock-1',
    user_id: 'mock-user-1',
    post_type: 'prediction' as const,
    caption: 'Feeling confident about this parlay tonight! 🔥',
    likes_count: 24,
    tails_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    profile: {
      display_name: 'SportsBettor23',
      email: 'user@example.com'
    },
    prediction: {
      selections: [
        { selection: 'Lakers ML', odds: -150 },
        { selection: 'Warriors ML', odds: -200 }
      ],
      amount: 50,
      bet_type: 'fun_tokens',
      status: 'completed',
      result: 'win'
    },
    user_liked: false
  },
  {
    id: 'mock-2',
    user_id: 'mock-user-2',
    post_type: 'template' as const,
    caption: 'My proven NBA strategy - been hitting 65% this season 📈',
    likes_count: 156,
    tails_count: 42,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    profile: {
      display_name: 'ProCapperJohn',
      email: 'pro@example.com'
    },
    template: {
      name: 'NBA Home Favorites',
      description: 'Betting on home teams favored by 5+ points',
      selections: [
        { selection: 'Celtics -6.5', odds: -110 },
        { selection: 'Nuggets -5.5', odds: -105 }
      ],
      bet_amount: 100,
      bet_type: 'growth_cash'
    },
    user_liked: true
  },
  {
    id: 'mock-3',
    user_id: 'mock-user-3',
    post_type: 'prediction' as const,
    caption: 'NFL Sunday slate looking juicy! Who else is tailing? 🏈',
    likes_count: 89,
    tails_count: 31,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    profile: {
      display_name: 'GridironGuru',
      email: 'football@example.com'
    },
    prediction: {
      selections: [
        { selection: 'Chiefs ML', odds: -180 },
        { selection: '49ers ML', odds: -140 },
        { selection: 'Ravens -3.5', odds: -110 }
      ],
      amount: 75,
      bet_type: 'growth_cash',
      status: 'pending'
    },
    user_liked: false
  }
];

export const SocialFeed = ({ onLoadTail, onSaveTemplate }: SocialFeedProps) => {
  const { posts, isLoading } = useSocialFeed();
  const { sendTip, loading: tipping } = useTipping();
  const [tipDialogOpen, setTipDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // Use mock data if no real posts
  const displayPosts = posts && posts.length > 0 ? posts : mockPosts;

  const handleTail = (post: any) => {
    const content = post.post_type === 'template' ? post.template : post.prediction;
    
    if (!content) {
      toast.error("Unable to tail this post");
      return;
    }

    // Convert selections to bet slip format
    const selections = content.selections || [];
    onLoadTail(selections, content.amount || content.bet_amount, content.bet_type);
    
    toast.success("Tailing bet! Selections loaded to your bet slip");
  };

  const handleSaveTemplate = (post: any) => {
    const content = post.post_type === 'template' ? post.template : post.prediction;
    
    if (!content) {
      toast.error("Unable to save template");
      return;
    }

    const selections = content.selections || [];
    const name = post.post_type === 'template' ? content.name : `${post.profile?.display_name}'s Bet`;
    const description = post.post_type === 'template' ? content.description : post.caption;
    
    onSaveTemplate(
      selections, 
      content.amount || content.bet_amount, 
      content.bet_type,
      name,
      description
    );
    
    toast.success("Template saved! Check your templates in the betting page");
  };

  const handleTip = (post: any) => {
    setSelectedPost(post);
    setTipDialogOpen(true);
  };

  const handleConfirmTip = async (amount: number) => {
    if (!selectedPost) return;
    
    const success = await sendTip(selectedPost.id, selectedPost.user_id, amount);
    if (success) {
      setTipDialogOpen(false);
      setSelectedPost(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Community Feed</h2>
          {displayPosts === mockPosts && (
            <span className="text-xs bg-muted px-2 py-1 rounded">Preview Mode</span>
          )}
        </div>
        {displayPosts.map((post) => (
          <SocialPostCard
            key={post.id}
            post={post}
            onTail={handleTail}
            onSaveTemplate={handleSaveTemplate}
            onTip={handleTip}
          />
        ))}
      </div>

      <TipDialog
        open={tipDialogOpen}
        onOpenChange={setTipDialogOpen}
        onConfirm={handleConfirmTip}
        posterName={selectedPost?.profile?.display_name || 'User'}
        loading={tipping}
      />
    </>
  );
};
