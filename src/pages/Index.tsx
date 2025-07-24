import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Pricing from "@/components/Pricing"
import EarlyAccess from "@/components/EarlyAccess"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <EarlyAccess />
      <Footer />
    </div>
  );
};

export default Index;
