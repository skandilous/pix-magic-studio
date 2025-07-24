import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BackgroundTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isPremium?: boolean;
}

const backgroundTemplates: BackgroundTemplate[] = [
  {
    id: 'gradient-1',
    name: 'Blue Gradient',
    description: 'Professional blue gradient background',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 'nature-1',
    name: 'Forest',
    description: 'Peaceful forest background',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 'nature-2',
    name: 'Mountain Vista',
    description: 'Majestic mountain landscape',
    imageUrl: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=400&h=300',
  },
  {
    id: 'abstract-1',
    name: 'Purple Abstract',
    description: 'Modern purple abstract design',
    imageUrl: 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=400&h=300',
    isPremium: true,
  },
  {
    id: 'city-1',
    name: 'City Skyline',
    description: 'Urban cityscape background',
    imageUrl: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=400&h=300',
    isPremium: true,
  },
  {
    id: 'nature-3',
    name: 'Ocean Waves',
    description: 'Calming ocean waves',
    imageUrl: 'https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=400&h=300',
    isPremium: true,
  },
];

interface BackgroundTemplatesProps {
  onSelectTemplate: (template: BackgroundTemplate) => void;
}

const BackgroundTemplates: React.FC<BackgroundTemplatesProps> = ({ onSelectTemplate }) => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleTemplateSelect = (template: BackgroundTemplate) => {
    if (template.isPremium && profile?.subscription_tier === 'free') {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Pro or Unlimited to access premium backgrounds.",
        variant: "destructive"
      });
      return;
    }
    
    onSelectTemplate(template);
  };

  const freeTemplates = backgroundTemplates.filter(t => !t.isPremium);
  const premiumTemplates = backgroundTemplates.filter(t => t.isPremium);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Templates</CardTitle>
        <CardDescription>
          Choose from our collection of professional backgrounds for your images
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Free Templates */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              Free Backgrounds
              <Badge variant="secondary">Free</Badge>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {freeTemplates.map((template) => (
                <div key={template.id} className="group cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                  <div className="relative overflow-hidden rounded-lg border hover:border-primary transition-colors">
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Templates */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              Premium Backgrounds
              <Badge variant="default">Pro+</Badge>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {premiumTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className={`group cursor-pointer ${
                    profile?.subscription_tier === 'free' ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="relative overflow-hidden rounded-lg border hover:border-primary transition-colors">
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {profile?.subscription_tier === 'free' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Badge variant="default" className="text-xs">Pro+</Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {profile?.subscription_tier === 'free' && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Unlock premium backgrounds with Pro or Unlimited plans
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Upgrade Plan
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundTemplates;