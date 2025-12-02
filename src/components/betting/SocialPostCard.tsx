import { TrendingUp, User, BookmarkPlus, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SocialPost } from "@/hooks/useSocialFeed";
import { formatDistanceToNow } from "date-fns";

interface SocialPostCardProps {
  post: SocialPost;
  onTail: (post: SocialPost) => void;
  onSaveTemplate: (post: SocialPost) => void;
  onTip: (post: SocialPost) => void;
}

export const SocialPostCard = ({ post, onTail, onSaveTemplate, onTip }: SocialPostCardProps) => {
  const getDisplayContent = () => {
    if (post.post_type === 'template' && post.template) {
      return {
        title: post.template.name,
        description: post.template.description,
        selections: post.template.selections,
        amount: post.template.bet_amount,
        betType: post.template.bet_type
      };
    } else if (post.post_type === 'prediction' && post.prediction) {
      return {
        title: "Prediction",
        selections: post.prediction.selections,
        amount: post.prediction.amount,
        betType: post.prediction.bet_type,
        status: post.prediction.status,
        result: post.prediction.result
      };
    }
    return null;
  };

  const content = getDisplayContent();
  if (!content) return null;

  const getStatusBadge = () => {
    if (post.post_type === 'prediction' && content.status) {
      if (content.result === 'win') {
        return <Badge variant="default" className="bg-green-500">Won</Badge>;
      } else if (content.result === 'loss') {
        return <Badge variant="destructive">Lost</Badge>;
      } else if (content.status === 'completed') {
        return <Badge variant="secondary">Completed</Badge>;
      } else {
        return <Badge variant="outline">Pending</Badge>;
      }
    }
    return null;
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{post.profile?.display_name || 'Anonymous'}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-bold text-lg mb-1">
          {post.post_type === 'template' ? '📋 ' : '🎯 '}
          {content.title}
        </h3>
        {content.description && (
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{content.description}</p>
        )}
        {post.caption && (
          <p className="text-xs md:text-sm mb-2">{post.caption}</p>
        )}
        
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Entry Amount:</span>
            <span className="font-semibold">${content.amount}</span>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Type:</span>
            <Badge variant="outline">
              {content.betType === 'fun_tokens' ? 'Fun Tokens' : 
               content.betType === 'growth_cash' ? 'Growth Cash' : 'Bonus Bet'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {Array.isArray(content.selections) && content.selections.length > 0 && (
              <div>
                <span className="font-medium">Selections:</span>
                <ul className="mt-1 space-y-1">
                  {content.selections.map((sel: any, idx: number) => (
                    <li key={idx} className="truncate">
                      • {sel.selection || sel.team || 'Selection'} ({sel.odds || 'N/A'})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t">
        {(post.total_tips || 0) > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/30 rounded-lg py-2">
            <DollarSign className="w-4 h-4" />
            <span>${(post.total_tips || 0).toFixed(2)} in tips received</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onTail(post)}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Tail
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSaveTemplate(post)}
            className="flex-1"
          >
            <BookmarkPlus className="w-4 h-4 mr-1" />
            Template
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onTip(post)}
            className="flex-1"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Tip
          </Button>
        </div>
      </div>
    </Card>
  );
};
