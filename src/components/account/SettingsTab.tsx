
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';

const SettingsTab = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // State for all settings (excluding dark mode which is handled by next-themes)
  const [settings, setSettings] = useState({
    currencyDisplay: true,
    quickBetAmounts: true,
    betConfirmations: true,
    dataSharing: true,
    marketingEmails: false
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const saveAllSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "All your preferences have been saved successfully.",
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">App Preferences</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light');
                toast({
                  title: "Theme Updated",
                  description: `Switched to ${checked ? 'dark' : 'light'} mode.`,
                });
              }}
            />
          </div>
          
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Currency Display</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Show amounts with currency symbols</p>
            </div>
            <Switch 
              checked={settings.currencyDisplay}
              onCheckedChange={(checked) => updateSetting('currencyDisplay', checked)}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Betting Preferences</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Quick Bet Amounts</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Show preset betting amounts for faster wagering</p>
            </div>
            <Switch 
              checked={settings.quickBetAmounts}
              onCheckedChange={(checked) => updateSetting('quickBetAmounts', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Bet Confirmations</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Require confirmation before placing bets</p>
            </div>
            <Switch 
              checked={settings.betConfirmations}
              onCheckedChange={(checked) => updateSetting('betConfirmations', checked)}
            />
          </div>
          
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Sharing</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Share anonymous data to improve our platform</p>
            </div>
            <Switch 
              checked={settings.dataSharing}
              onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Marketing Communications</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Receive marketing emails and offers</p>
            </div>
            <Switch 
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button onClick={saveAllSettings}>Save Settings</Button>
        <DeleteAccountDialog />
      </CardFooter>
    </Card>
  );
};

export default SettingsTab;
