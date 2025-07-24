import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Mail, Sparkles, Gift } from "lucide-react"

const EarlyAccess = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      const response = await fetch("https://formspree.io/f/myzpeqrp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          _subject: "New PicPerf.ai Early Access Signup",
        }),
      })

      if (response.ok) {
        toast({
          title: "Welcome to Early Access! 🎉",
          description: "You'll be among the first to try PicPerf.ai when we launch.",
        })
        setEmail("")
      } else {
        toast({
          title: "Oops! Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-primary text-white border-0 shadow-primary">
            <Gift className="w-4 h-4 mr-1" />
            Limited Time Offer
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Get Early Access to
            <span className="text-primary"> PicPerf.ai</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be among the first 1,000 users to experience our AI-powered photo enhancement platform. 
            Early access members get <strong>50% off</strong> their first year plus exclusive features.
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Beta Access</h3>
              <p className="text-sm text-muted-foreground">First to try new features</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 text-success rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">50% Discount</h3>
              <p className="text-sm text-muted-foreground">On your first year subscription</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 text-warning rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">Direct line to our team</p>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3 mb-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button 
                type="submit" 
                variant="hero"
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </form>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Join <strong>2,847</strong> other sellers already on the waitlist
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                and counting...
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EarlyAccess