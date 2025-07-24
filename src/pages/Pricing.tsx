import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Zap, Crown, Star } from 'lucide-react';

const PricingPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'unlimited') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive"
      });
      return;
    }

    setLoading(plan);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading('manage');

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Portal access failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out PicPerf',
      features: [
        '10 images per month',
        'Basic background removal',
        'Watermarked exports',
        'Limited background presets',
        'Standard support'
      ],
      icon: <Star className="h-6 w-6" />,
      current: profile?.subscription_tier === 'free',
      buttonText: 'Current Plan',
      disabled: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'Great for professionals and creators',
      features: [
        '50 images per month',
        'HD exports',
        'No watermark',
        'Access to more background styles',
        'Priority email support',
        'Batch processing'
      ],
      icon: <Zap className="h-6 w-6" />,
      popular: true,
      current: profile?.subscription_tier === 'pro',
      buttonText: profile?.subscription_tier === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro',
      action: profile?.subscription_tier === 'pro' ? handleManageSubscription : () => handleUpgrade('pro')
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: '$29.99',
      period: '/month',
      description: 'Perfect for businesses and power users',
      features: [
        'Unlimited image processing',
        'Premium HD exports',
        'No watermark',
        'Full template library',
        'Priority support',
        'API access (up to threshold)',
        'Advanced editing tools',
        'Team collaboration'
      ],
      icon: <Crown className="h-6 w-6" />,
      current: profile?.subscription_tier === 'unlimited',
      buttonText: profile?.subscription_tier === 'unlimited' ? 'Manage Subscription' : 'Upgrade to Unlimited',
      action: profile?.subscription_tier === 'unlimited' ? handleManageSubscription : () => handleUpgrade('unlimited')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your images with AI-powered background removal. 
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-primary shadow-primary/20 scale-105' : ''
              } ${plan.current ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              {plan.current && (
                <Badge className="absolute -top-3 right-4 bg-success text-white">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mb-4 flex justify-center text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.current ? "outline" : plan.popular ? "hero" : "default"}
                  disabled={plan.disabled || loading !== null}
                  onClick={plan.action}
                >
                  {loading === plan.id || (loading === 'manage' && plan.current) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Need something custom?</h3>
          <p className="text-muted-foreground mb-6">
            For enterprise customers or high-volume API usage, we offer custom plans.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>

        {user && profile && (
          <div className="mt-12 max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Your Current Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">
                    {profile.images_processed}/{profile.usage_limit === 999999 ? '∞' : profile.usage_limit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Images processed this month
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-4">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: profile.usage_limit === 999999 
                          ? '100%' 
                          : `${Math.min((profile.images_processed / profile.usage_limit) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;