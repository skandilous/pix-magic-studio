import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import heroBanner from "@/assets/hero-banner.jpg"

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-gradient-primary text-white border-0 shadow-primary">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Image Enhancement
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
            Create Studio-Quality
            <br />
            Product Photos
            <span className="text-primary"> Instantly</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your e-commerce product images with AI-powered background removal, 
            professional templates, and automatic sizing for all major platforms.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="group">
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-glow border border-border/50 bg-gradient-card">
              <img 
                src={heroBanner} 
                alt="PicPerf.ai Dashboard Preview" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium hidden lg:block">
              ✨ AI Enhanced
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium hidden lg:block">
              🚀 Lightning Fast
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">Trusted by 10,000+ e-commerce sellers</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">Amazon</div>
              <div className="text-2xl font-bold">Etsy</div>
              <div className="text-2xl font-bold">Shopify</div>
              <div className="text-2xl font-bold">eBay</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero