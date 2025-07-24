import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Pricing from "@/components/Pricing"
import EarlyAccess from "@/components/EarlyAccess"
import Footer from "@/components/Footer"
import ImageProcessor from "@/components/ImageProcessor"

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {user ? (
        <main className="pt-20">
          <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                  Perfect Your Images with AI
                </h1>
                <p className="text-xl text-muted-foreground">
                  Remove backgrounds, enhance quality, and perfect your images in seconds.
                </p>
              </div>
              <ImageProcessor />
            </div>
          </div>
        </main>
      ) : (
        <>
          <Hero />
          <Features />
          <Pricing />
          <EarlyAccess />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;
