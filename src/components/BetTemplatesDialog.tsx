import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Trash2, Copy, Star } from 'lucide-react';
import { useBetTemplates } from '@/hooks/useBetTemplates';

interface BetTemplatesDialogProps {
  betSlip: any[];
  betAmount: number;
  betType: string;
  onLoadTemplate: (template: any) => void;
}

export const BetTemplatesDialog = ({ 
  betSlip, 
  betAmount, 
  betType, 
  onLoadTemplate 
}: BetTemplatesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const { templates, saveTemplate, useTemplate, deleteTemplate } = useBetTemplates();

  const handleSaveTemplate = async () => {
    if (!templateName || betSlip.length === 0) return;

    await saveTemplate.mutateAsync({
      name: templateName,
      description: templateDescription,
      selections: betSlip,
      betAmount,
      betType,
      isPublic
    });

    setTemplateName('');
    setTemplateDescription('');
    setIsPublic(false);
    setShowSaveForm(false);
  };

  const handleLoadTemplate = async (template: any) => {
    await useTemplate.mutateAsync(template.id);
    onLoadTemplate({
      selections: template.selections,
      betAmount: template.bet_amount,
      betType: template.bet_type
    });
    setIsOpen(false);
  };

  const myTemplates = templates?.filter(t => t.user_id) || [];
  const publicTemplates = templates?.filter(t => t.is_public && !myTemplates.find(mt => mt.id === t.id)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Bet Templates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Save Current Bet as Template */}
          {betSlip.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Save Current Bet</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSaveForm(!showSaveForm)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Save as Template
                  </Button>
                </div>
              </CardHeader>
              {showSaveForm && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description (Optional)</Label>
                    <Textarea
                      id="template-description"
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="Describe this betting strategy"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-template"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <Label htmlFor="public-template">Make this template public</Label>
                  </div>
                  <Button
                    onClick={handleSaveTemplate}
                    disabled={!templateName || saveTemplate.isPending}
                    className="w-full"
                  >
                    {saveTemplate.isPending ? 'Saving...' : 'Save Template'}
                  </Button>
                </CardContent>
              )}
            </Card>
          )}

          {/* My Templates */}
          {myTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">My Templates</h3>
              <div className="grid gap-3">
                {myTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-accent/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{template.name}</h4>
                            {template.is_public && (
                              <Badge variant="secondary" className="text-xs">
                                Public
                              </Badge>
                            )}
                          </div>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {template.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>${template.bet_amount} • {template.bet_type}</span>
                            <span>{template.selections.length} selections</span>
                            <span>Used {template.times_used} times</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoadTemplate(template)}
                            className="gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Use
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTemplate.mutate(template.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Public Templates */}
          {publicTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Popular Public Templates
              </h3>
              <div className="grid gap-3">
                {publicTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-accent/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{template.name}</h4>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {template.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>${template.bet_amount} • {template.bet_type}</span>
                            <span>{template.selections.length} selections</span>
                            <span>Used {template.times_used} times</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadTemplate(template)}
                          className="gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(!templates || templates.length === 0) && (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
                <p className="text-muted-foreground">
                  Create your first template by adding selections to your bet slip and saving it.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};