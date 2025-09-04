import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Camera, Search, Shield, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: Camera,
    title: "Snap. Compare. Save Your Crops.",
    description: "Take a photo of any plant or crop to get instant health insights powered by AI.",
    gradient: "bg-gradient-to-br from-primary/20 to-accent/20"
  },
  {
    icon: Search,
    title: "AI diagnoses issues instantly & recommends solutions.",
    description: "See side-by-side comparisons with healthy plants and get expert recommendations.",
    gradient: "bg-gradient-to-br from-accent/20 to-success/20"
  },
  {
    icon: Shield,
    title: "Protect your yield. Anytime. Anywhere.",
    description: "Works offline with multilingual support. Your farming assistant is always ready.",
    gradient: "bg-gradient-to-br from-success/20 to-primary/20"
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/auth');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">AgroEng AI</h1>
          <p className="text-muted-foreground">Your Smart Farming Assistant</p>
        </div>

        {/* Slide Content */}
        <Card className={`${currentSlideData.gradient} border-0 p-8 mb-8 animate-fade-in`}>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Icon className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {currentSlideData.title}
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              {currentSlideData.description}
            </p>
          </div>
        </Card>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="h-12 w-12"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            onClick={nextSlide}
            className="flex-1 mx-4 h-12 text-lg font-semibold"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            {currentSlide < slides.length - 1 && <ChevronRight className="ml-2 h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="h-12 px-4 text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}