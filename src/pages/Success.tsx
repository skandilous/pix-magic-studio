import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [checking, setChecking] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Refresh subscription status
      const checkSubscription = async () => {
        try {
          // Wait a bit for Stripe webhook to process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data, error } = await supabase.functions.invoke('check-subscription');
          
          if (!error && data) {
            setSubscriptionDetails(data);
            await refreshProfile();
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        } finally {
          setChecking(false);
        }
      };

      checkSubscription();
    } else {
      setChecking(false);
    }
  }, [searchParams, refreshProfile]);

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'pro': return 'Pro';
      case 'unlimited': return 'Unlimited';
      default: return 'Free';
    }
  };

  const getTierBenefits = (tier: string) => {
    switch (tier) {
      case 'pro':
        return [
          '50 images per month',
          'HD exports without watermark',
          'Access to premium background styles',
          'Priority email support'
        ];
      case 'unlimited':
        return [
          'Unlimited image processing',
          'Premium HD exports',
          'Full template library access',
          'API access up to threshold',
          'Priority support'
        ];
      default:
        return [];
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold">Processing your subscription...</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment and activate your plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Welcome to PicPerf {subscriptionDetails?.subscription_tier ? getTierDisplayName(subscriptionDetails.subscription_tier) : 'Pro'}! 
            Your subscription is now active.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {subscriptionDetails && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Your Plan Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">
                      {getTierDisplayName(subscriptionDetails.subscription_tier)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Limit:</span>
                    <span className="font-medium">
                      {subscriptionDetails.usage_limit === 999999 
                        ? 'Unlimited' 
                        : `${subscriptionDetails.usage_limit} images`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-success capitalize">
                      {subscriptionDetails.subscription_status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What's included:</h3>
                <ul className="space-y-1">
                  {getTierBenefits(subscriptionDetails.subscription_tier).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/')} className="w-full">
              Start Processing Images
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="w-full"
            >
              View All Plans
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              You can manage your subscription anytime from the pricing page.
              Need help? Contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;