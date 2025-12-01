
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Camera, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';
import html2canvas from 'html2canvas';
import { useBalance } from '@/hooks/useBalance';

interface SharePopoverProps {
  className?: string;
  portfolioRef?: React.RefObject<HTMLDivElement>;
}

export const SharePopover = ({ className, portfolioRef }: SharePopoverProps) => {
  const { balance } = useBalance();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard! Share your generational wealth journey!");
  };
  
  const handleShareViaText = async () => {
    const shareText = "Check out how I'm building generational wealth for our future! " + window.location.href;
    
    // Try Web Share API first (works on mobile devices)
    if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
      try {
        await navigator.share({
          title: 'My Investment Portfolio',
          text: shareText,
        });
        return;
      } catch (err) {
        console.error('Error sharing:', err);
        // Fall through to SMS fallback
      }
    }
    
    // Fallback: Create SMS link
    const smsBody = encodeURIComponent(shareText);
    const smsUrl = `sms:?body=${smsBody}`;
    
    // Try to open SMS app
    try {
      window.open(smsUrl, '_self');
      toast.success("Opening your text messaging app...");
    } catch (err) {
      console.error('Error opening SMS:', err);
      // Final fallback: copy to clipboard
      handleCopyLink();
      toast.info("SMS not available. Link copied to clipboard instead!");
    }
  };

  const handleCaptureSnapshot = async () => {
    if (!portfolioRef?.current) {
      toast.error("Portfolio chart not available for capture");
      return;
    }

    try {
      const canvas = await html2canvas(portfolioRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `portfolio-snapshot-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success("Portfolio snapshot downloaded!");
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing snapshot:', error);
      toast.error("Failed to capture portfolio snapshot");
    }
  };

  const handleShareWithSnapshot = async () => {
    if (!portfolioRef?.current) {
      toast.error("Portfolio chart not available");
      return;
    }

    try {
      const canvas = await html2canvas(portfolioRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'portfolio-snapshot.png', { type: 'image/png' });
          const portfolioValue = balance?.invested_balance || 0;
          const shareText = `Check out my portfolio progress! Current value: $${portfolioValue.toFixed(2)} 📈 Building generational wealth for our future! ${window.location.href}`;
          
          // Try Web Share API with image (works on mobile)
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: 'My Investment Portfolio',
                text: shareText,
                files: [file]
              });
              return;
            } catch (err) {
              console.error('Error sharing with image:', err);
              // Fall through to text-only share
            }
          }
          
          // Fallback to text-only share
          handleShareViaText();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error creating snapshot for sharing:', error);
      // Fallback to text-only share
      handleShareViaText();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 border-primary hover:bg-primary/10 ${className}`}
        >
          <Heart className="text-primary" />
          Share with Wife
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5">
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Show her how you've been investing for our future</h3>
          <p className="text-muted-foreground">
            Share your portfolio progress and demonstrate how you're building <span className="font-semibold">generational wealth</span> together.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleShareWithSnapshot} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Share with Portfolio Snapshot
            </Button>
            <Button onClick={handleCaptureSnapshot} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Portfolio Image
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="w-full">
              Copy Link Only
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;
