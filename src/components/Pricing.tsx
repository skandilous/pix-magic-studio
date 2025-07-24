import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown } from "lucide-react"

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out PicPerf.ai",
      features: [
        "10 images per month",
        "Basic background removal",
        "5 template backgrounds",
        "Standard resolution (1080p)",
        "Email support"
      ],
      cta: "Get Started Free",
      variant: "outline" as const,
      popular: false,
      icon: <Star className="w-5 h-5" />
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For growing e-commerce businesses",
      features: [
        "50 images per month",
        "Advanced AI background removal",
        "25+ premium templates",
        "High resolution (4K)",
        "Bulk processing (up to 10)",
        "Platform auto-sizing",
        "Priority support",
        "Commercial license"
      ],
      cta: "Start Pro Trial",
      variant: "hero" as const,
      popular: true,
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: "Unlimited",
      price: "$29.99",
      period: "per month",
      description: "For high-volume sellers and agencies",
      features: [
        "Unlimited images",
        "Advanced AI + custom models",
        "50+ premium templates",
        "Ultra-high resolution (8K)",
        "Unlimited bulk processing",
        "API access",
        "Custom backgrounds",
        "White-label solution",
        "Dedicated support",
        "Advanced analytics"
      ],
      cta: "Go Unlimited",
      variant: "premium" as const,
      popular: false,
      icon: <Crown className="w-5 h-5" />
    }
  ]

  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-success/10 text-success border-success/20">
            💰 Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Choose Your
            <span className="text-primary"> Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-card transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary shadow-primary bg-gradient-card ring-2 ring-primary/20' 
                  : 'border-border/50 bg-gradient-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white border-0 shadow-primary">
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <Button 
                  variant={plan.variant} 
                  size="lg" 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground flex-1">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-muted-foreground text-sm">Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What happens to unused credits?</h4>
              <p className="text-muted-foreground text-sm">Unused credits roll over to the next month (up to 2x your plan limit).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-muted-foreground text-sm">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there an API available?</h4>
              <p className="text-muted-foreground text-sm">Yes! API access is included with the Unlimited plan for seamless integrations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing