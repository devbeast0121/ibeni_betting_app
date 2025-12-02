import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Shield, ExternalLink } from 'lucide-react';
import ResponsibleGamblingModal from './ResponsibleGamblingModal';

const LegalDisclaimerBanner = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('legalDisclaimerAcknowledged');
  });
  const [showResponsibleGambling, setShowResponsibleGambling] = useState(false);

  const handleAcknowledge = () => {
    localStorage.setItem('legalDisclaimerAcknowledged', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="p-4 mt-4">
        <Alert className="border-amber-200 bg-amber-50 text-amber-800 ">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-semibold">18+ Only | Entertainment Purposes | Know Your Limits</p>
                <p className="text-xs">
                  This platform is for entertainment only. Sports predictions involve risk.
                  Please predict responsibly and only with money you can afford to lose.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                  onClick={() => setShowResponsibleGambling(true)}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                  onClick={() => window.open('/terms', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Terms
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAcknowledge}
                  className="text-amber-700 hover:bg-amber-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <ResponsibleGamblingModal
          isOpen={showResponsibleGambling}
          onClose={() => setShowResponsibleGambling(false)}
        />
      </div>
    </>
  );
};

export default LegalDisclaimerBanner;