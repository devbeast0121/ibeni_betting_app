import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNativeShare, useHapticFeedback } from '@/hooks/use-mobile-features';
import { useToast } from '@/hooks/use-toast';

interface MobileShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function MobileShareButton({ 
  title = 'Check out ibeni!',
  text = 'Sports betting and investment platform',
  url,
  variant = 'outline',
  size = 'sm'
}: MobileShareButtonProps) {
  const { share } = useNativeShare();
  const { success } = useHapticFeedback();
  const { toast } = useToast();

  const handleShare = async () => {
    success();
    
    const shareData = {
      title,
      text,
      url: url || window.location.href,
    };

    const shared = await share(shareData);
    
    if (!shared) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${title} - ${text} ${shareData.url}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share link has been copied.",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share at this time.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}