import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface PlatformSize {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  description: string;
  category: 'social' | 'ecommerce' | 'marketing';
}

const PLATFORM_SIZES: PlatformSize[] = [
  // Social Media
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    description: 'Square post format',
    category: 'social'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    description: 'Vertical story format',
    category: 'social'
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    platform: 'Facebook',
    width: 1200,
    height: 630,
    description: 'Landscape post format',
    category: 'social'
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    platform: 'Facebook',
    width: 1200,
    height: 315,
    description: 'Cover photo dimensions',
    category: 'social'
  },
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    platform: 'Twitter/X',
    width: 1200,
    height: 675,
    description: 'Landscape tweet format',
    category: 'social'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    platform: 'LinkedIn',
    width: 1200,
    height: 627,
    description: 'Professional post format',
    category: 'social'
  },
  // E-commerce
  {
    id: 'amazon-main',
    name: 'Amazon Main Image',
    platform: 'Amazon',
    width: 2000,
    height: 2000,
    description: 'Primary product image',
    category: 'ecommerce'
  },
  {
    id: 'amazon-additional',
    name: 'Amazon Additional',
    platform: 'Amazon',
    width: 1500,
    height: 1500,
    description: 'Secondary product images',
    category: 'ecommerce'
  },
  {
    id: 'etsy-listing',
    name: 'Etsy Listing',
    platform: 'Etsy',
    width: 2000,
    height: 2000,
    description: 'Main listing image',
    category: 'ecommerce'
  },
  {
    id: 'shopify-product',
    name: 'Shopify Product',
    platform: 'Shopify',
    width: 2048,
    height: 2048,
    description: 'Product image format',
    category: 'ecommerce'
  },
  // Marketing
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    platform: 'Pinterest',
    width: 1000,
    height: 1500,
    description: 'Vertical pin format',
    category: 'marketing'
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    platform: 'YouTube',
    width: 1280,
    height: 720,
    description: 'Video thumbnail',
    category: 'marketing'
  }
];

interface PlatformSizingProps {
  selectedPlatform: PlatformSize | null;
  onSelectPlatform: (platform: PlatformSize | null) => void;
}

export const PlatformSizing: React.FC<PlatformSizingProps> = ({
  selectedPlatform,
  onSelectPlatform
}) => {
  const categories = ['social', 'ecommerce', 'marketing'] as const;
  
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'social': return 'Social Media';
      case 'ecommerce': return 'E-commerce';
      case 'marketing': return 'Marketing';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'ecommerce': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'marketing': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Auto-Sizing</CardTitle>
        <CardDescription>
          Automatically resize your images for popular platforms and marketplaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {selectedPlatform && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{selectedPlatform.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlatform.width} × {selectedPlatform.height}px - {selectedPlatform.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectPlatform(null)}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {categories.map((category) => {
            const platformsInCategory = PLATFORM_SIZES.filter(p => p.category === category);
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  {getCategoryTitle(category)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {platformsInCategory.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={selectedPlatform?.id === platform.id ? "default" : "outline"}
                      className="h-auto p-3 justify-start"
                      onClick={() => onSelectPlatform(platform)}
                    >
                      <div className="text-left w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{platform.name}</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getCategoryColor(category)}`}
                          >
                            {platform.platform}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {platform.width} × {platform.height}px
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {platform.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};