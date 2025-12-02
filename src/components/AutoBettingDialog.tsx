import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Users, Settings, Star, Verified } from 'lucide-react';
import { useAutoBetting } from '@/hooks/useAutoBetting';

export const AutoBettingDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, expertTraders, updateSettings, becomeExpert } = useAutoBetting();
  
  const [formData, setFormData] = useState({
    is_enabled: settings?.is_enabled || false,
    follow_user_id: settings?.follow_user_id || '',
    max_bet_amount: settings?.max_bet_amount || 10,
    bet_multiplier: settings?.bet_multiplier || 1.0,
    min_odds: settings?.min_odds || 1.5,
    max_odds: settings?.max_odds || 5.0,
    sports_filter: settings?.sports_filter || []
  });

  const [expertForm, setExpertForm] = useState({
    display_name: '',
    bio: ''
  });

  const handleSettingsUpdate = async () => {
    await updateSettings.mutateAsync(formData);
  };

  const handleBecomeExpert = async () => {
    if (!expertForm.display_name) return;
    await becomeExpert.mutateAsync({ 
      displayName: expertForm.display_name, 
      bio: expertForm.bio 
    });
    setExpertForm({ display_name: '', bio: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bot className="h-4 w-4" />
          Auto Betting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Auto Betting & Copy Trading
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="experts">Expert Traders</TabsTrigger>
            <TabsTrigger value="become-expert">Become Expert</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Auto Betting Configuration
                </CardTitle>
                <CardDescription>
                  Configure automatic betting rules and copy trading settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-betting-enabled"
                    checked={formData.is_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_enabled: checked }))}
                  />
                  <Label htmlFor="auto-betting-enabled">Enable Auto Betting</Label>
                </div>

                {formData.is_enabled && (
                  <div className="space-y-4 border-l-2 border-primary pl-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-bet">Maximum Bet Amount ($)</Label>
                        <Input
                          id="max-bet"
                          type="number"
                          value={formData.max_bet_amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_bet_amount: Number(e.target.value) }))}
                          min="1"
                          max="1000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bet-multiplier">Bet Multiplier</Label>
                        <Input
                          id="bet-multiplier"
                          type="number"
                          step="0.1"
                          value={formData.bet_multiplier}
                          onChange={(e) => setFormData(prev => ({ ...prev, bet_multiplier: Number(e.target.value) }))}
                          min="0.1"
                          max="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="min-odds">Minimum Odds</Label>
                        <Input
                          id="min-odds"
                          type="number"
                          step="0.1"
                          value={formData.min_odds}
                          onChange={(e) => setFormData(prev => ({ ...prev, min_odds: Number(e.target.value) }))}
                          min="1.0"
                          max="10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max-odds">Maximum Odds</Label>
                        <Input
                          id="max-odds"
                          type="number"
                          step="0.1"
                          value={formData.max_odds}
                          onChange={(e) => setFormData(prev => ({ ...prev, max_odds: Number(e.target.value) }))}
                          min="1.0"
                          max="50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="follow-expert">Follow Expert Trader (Optional)</Label>
                      <Select 
                        value={formData.follow_user_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, follow_user_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an expert to follow" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Expert (Auto Rules Only)</SelectItem>
                          {expertTraders?.map((expert) => (
                            <SelectItem key={expert.id} value={expert.user_id}>
                              {expert.display_name} - {expert.win_rate.toFixed(1)}% win rate
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSettingsUpdate} 
                  disabled={updateSettings.isPending}
                  className="w-full"
                >
                  {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Expert Traders
                </CardTitle>
                <CardDescription>
                  Follow successful traders and copy their betting strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {expertTraders?.map((expert) => (
                    <Card key={expert.id} className="cursor-pointer hover:bg-accent/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{expert.display_name}</h4>
                              {expert.is_verified && (
                                <Verified className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            {expert.bio && (
                              <p className="text-xs md:text-sm text-muted-foreground mb-3">
                                {expert.bio}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs md:text-sm">
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                {expert.win_rate.toFixed(1)}% Win Rate
                              </Badge>
                              <span className="text-muted-foreground">
                                {expert.followers_count} followers
                              </span>
                              <span className={expert.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                ${expert.total_profit.toFixed(2)} profit
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {expert.subscription_fee > 0 && (
                              <Badge variant="outline">
                                ${expert.subscription_fee}/month
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, follow_user_id: expert.user_id }))}
                              className="gap-1"
                            >
                              <Star className="h-3 w-3" />
                              Follow
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {(!expertTraders || expertTraders.length === 0) && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Expert Traders Yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to become an expert trader!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="become-expert" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Become an Expert Trader
                </CardTitle>
                <CardDescription>
                  Share your betting expertise and gain followers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expert-name">Display Name</Label>
                  <Input
                    id="expert-name"
                    value={expertForm.display_name}
                    onChange={(e) => setExpertForm(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Your expert trader name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expert-bio">Bio (Optional)</Label>
                  <Input
                    id="expert-bio"
                    value={expertForm.bio}
                    onChange={(e) => setExpertForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your betting strategy and experience"
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Expert Requirements:</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <li>• Minimum 60% win rate over 50+ bets</li>
                    <li>• Positive profit over the last 3 months</li>
                    <li>• Active betting history</li>
                    <li>• Clean account with no violations</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleBecomeExpert}
                  disabled={!expertForm.display_name || becomeExpert.isPending}
                  className="w-full"
                >
                  {becomeExpert.isPending ? 'Submitting...' : 'Apply to Become Expert'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};