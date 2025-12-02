import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ExternalLink, Phone, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResponsibleGamblingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResponsibleGamblingModal = ({ isOpen, onClose }: ResponsibleGamblingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Responsible Gaming Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Entertainment Only:</strong> This platform is for entertainment purposes. 
              Never wager more than you can afford to lose.
            </AlertDescription>
          </Alert>

          <section>
            <h3 className="font-semibold mb-2">Warning Signs of Problem Gambling</h3>
            <ul className="text-xs md:text-sm space-y-1 text-muted-foreground">
              <li>• Thinking about gambling constantly</li>
              <li>• Betting more money than you can afford</li>
              <li>• Lying about gambling activities</li>
              <li>• Chasing losses with bigger bets</li>
              <li>• Neglecting work, family, or other responsibilities</li>
              <li>• Feeling depressed or anxious about gambling</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-2">Self-Help Tools</h3>
            <div className="space-y-2 text-xs md:text-sm">
              <p>• Set daily, weekly, and monthly spending limits</p>
              <p>• Take regular breaks from the platform</p>
              <p>• Never chase losses</p>
              <p>• Don't gamble when upset, depressed, or under the influence</p>
              <p>• Balance gambling with other activities</p>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-3">Get Help - Support Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">National Problem Gambling Helpline</p>
                  <p className="text-xs md:text-sm text-muted-foreground">24/7 confidential support</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-mono">1-800-522-4700</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Gambling Therapy</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Free online support</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.gamblingtherapy.org', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Gamblers Anonymous</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Find local meetings</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.gamblersanonymous.org', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">National Council on Problem Gambling</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Resources and education</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.ncpgambling.org', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-2">Account Controls</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              If you need help controlling your gambling, you can:
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Set Deposit Limits
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Set Time Limits
              </Button>
              <Button variant="outline" className="w-full justify-start text-amber-600">
                Take a Break (24h - 30 days)
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Self-Exclude Account
              </Button>
            </div>
          </section>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsibleGamblingModal;