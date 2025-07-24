import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Wand2, 
  Crop, 
  Palette, 
  Zap, 
  Download, 
  Layers,
  Target,
  Sparkles,
  Clock
} from "lucide-react"

const Features = () => {
  const features = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI Background Removal",
      description: "Remove backgrounds instantly with pixel-perfect precision. Our advanced AI handles complex edges, hair, and transparent objects.",
      badge: "AI Powered"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Professional Templates",
      description: "Choose from 50+ studio-quality backgrounds including minimalist whites, lifestyle scenes, and custom gradients.",
      badge: "50+ Templates"
    },
    {
      icon: <Crop className="w-8 h-8" />,
      title: "Platform Auto-Sizing",
      description: "Automatically resize and optimize your images for Amazon, Etsy, Instagram, Facebook, and other platforms.",
      badge: "Multi-Platform"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Bulk Processing",
      description: "Process hundreds of images at once. Perfect for large catalogs and inventory updates.",
      badge: "Pro Feature"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Enhancement",
      description: "AI automatically adjusts lighting, contrast, and color balance to make your products pop.",
      badge: "Enhanced"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Get professional results in seconds, not hours. Our optimized AI processes images up to 10x faster.",
      badge: "Fast"
    }
  ]

  return (
    <section id="features" className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything You Need to Create
            <span className="text-primary"> Perfect Product Photos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform gives you professional-grade tools to transform 
            ordinary product photos into sales-driving images.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-card transition-all duration-300 border-border/50 bg-gradient-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Layers className="w-4 h-4" />
            <span>Ready to transform your product photos?</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-hero text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300">
              Try Free Now
            </button>
            <button className="px-8 py-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              View Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features