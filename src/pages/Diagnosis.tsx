import { useState } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, CheckCircle, ArrowRight, BookOpen, Volume2, Users, ThumbsUp, ThumbsDown, Leaf, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Diagnosis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get data from navigation state (in real app, this would come from API)
  const { image, plant = "Tomato", issue = "Leaf Blight (Fungal)", cause } = location.state || {};

  // Mock healthy plant image URL
  const healthyPlantImage = "https://images.unsplash.com/photo-1592479286881-62c8a1e07a4c?w=400&h=400&fit=crop";

  // Crowdsourcing state
  const [crowdsourceCrop, setCrowdsourceCrop] = useState("");
  const [crowdsourceProblem, setCrowdsourceProblem] = useState("");
  
  // Feedback state
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackPositive, setFeedbackPositive] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  // Audio explanation
  const [isPlaying, setIsPlaying] = useState(false);

  const crops = [
    "Cassava", "Yam", "Maize", "Tomato", "Okra", "Groundnut", 
    "Sweet Potato", "Plantain", "Rice", "Cowpea", "Pepper", "Onion"
  ];

  const commonProblems = [
    "Leaf spot", "Yellowing", "Wilting", "Root rot", "Pest damage", 
    "Nutrient deficiency", "Fungal infection", "Bacterial infection"
  ];

  const handleCrowdsourceSubmit = () => {
    if (!crowdsourceCrop) {
      toast({
        title: "Please select a crop",
        description: "Help us improve by identifying the crop type.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Thanks for your help!",
      description: "Your feedback helps improve our AI accuracy.",
    });
    
    // Reset form
    setCrowdsourceCrop("");
    setCrowdsourceProblem("");
  };

  const handleFeedback = (isPositive) => {
    setFeedbackPositive(isPositive);
    setFeedbackGiven(true);
    
    if (isPositive) {
      toast({
        title: "Thank you!",
        description: "We're glad the diagnosis was helpful.",
      });
    }
  };

  const submitFeedback = () => {
    toast({
      title: "Feedback received!",
      description: "Thank you for helping us improve our service.",
    });
    setFeedbackText("");
  };

  const playAudioExplanation = () => {
    setIsPlaying(true);
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      toast({
        title: "Audio explanation played",
        description: "In a real app, this would play TTS audio in your selected language.",
      });
    }, 3000);
  };

  return (
    <PageLayout title="Diagnosis Results" showNavigation={true}>
      <div className="p-4 space-y-6">
        {/* Results Header */}
        <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold mb-2">Here's What We Found</h2>
          <p className="text-muted-foreground">
            Analysis complete - here are your results
          </p>
        </Card>

        {/* Side-by-side Image Comparison */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 text-center">Visual Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <img 
                src={image || '/placeholder.svg'} 
                alt="Your plant" 
                className="w-full aspect-square object-cover rounded-lg border-2 border-destructive/30"
              />
              <p className="text-sm text-center font-medium text-destructive">Your Plant</p>
            </div>
            <div className="space-y-2">
              <img 
                src={healthyPlantImage} 
                alt="Healthy plant" 
                className="w-full aspect-square object-cover rounded-lg border-2 border-success/30"
              />
              <p className="text-sm text-center font-medium text-success">Healthy Reference</p>
            </div>
          </div>
        </Card>

        {/* Diagnosis Information */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plant Identified</p>
              <p className="font-semibold text-lg">{plant}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issue Detected</p>
              <p className="font-semibold text-lg text-destructive">{issue}</p>
            </div>
          </div>

          {cause && (
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-warning/10 rounded-full">
                <Brain className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Likely Cause</p>
                <p className="font-medium">{cause}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Severity Indicator */}
        <Card className="p-4 bg-warning/5 border-warning/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/20 rounded-full">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-warning">Moderate Severity</p>
                <p className="text-sm text-muted-foreground">Action needed within 1-2 days</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-warning">7/10</div>
              <div className="text-xs text-muted-foreground">Urgency</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-semibold"
            onClick={() => navigate('/solutions', { 
              state: { plant, issue, cause, image }
            })}
          >
            <ArrowRight className="mr-2 h-6 w-6" />
            View Treatment Solutions
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/camera')}
              className="h-12"
            >
              Scan Another Plant
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/tips')}
              className="h-12"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Audio Explanation */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Volume2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Audio Explanation</p>
                <p className="text-sm text-muted-foreground">
                  Listen to diagnosis in your language
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={playAudioExplanation}
              disabled={isPlaying}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {isPlaying ? "Playing..." : "Listen"}
            </Button>
          </div>
        </Card>

        {/* Crowdsourcing Section */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-full">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Help Improve AgroEng AI</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What crop is this? *
              </label>
              <Select value={crowdsourceCrop} onValueChange={setCrowdsourceCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop} value={crop.toLowerCase()}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                What problem do you see? (Optional)
              </label>
              <Select value={crowdsourceProblem} onValueChange={setCrowdsourceProblem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or describe the problem" />
                </SelectTrigger>
                <SelectContent>
                  {commonProblems.map((problem) => (
                    <SelectItem key={problem} value={problem.toLowerCase()}>
                      {problem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleCrowdsourceSubmit}
              className="w-full"
              variant="outline"
            >
              Submit Feedback
            </Button>
          </div>
        </Card>

        {/* Feedback Loop */}
        {!feedbackGiven && (
          <Card className="p-6 bg-gradient-to-br from-success/5 to-primary/5">
            <h3 className="font-semibold mb-4 text-center">Did the diagnosis help you?</h3>
            <div className="flex gap-3">
              <Button 
                className="flex-1 h-12"
                onClick={() => handleFeedback(true)}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Yes
              </Button>
              <Button 
                variant="outline"
                className="flex-1 h-12"
                onClick={() => handleFeedback(false)}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                No
              </Button>
            </div>
          </Card>
        )}

        {feedbackGiven && feedbackPositive === false && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">Tell us what went wrong (optional)</h4>
            <div className="space-y-3">
              <Input
                placeholder="What could we improve?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
              <Button 
                onClick={submitFeedback}
                size="sm"
                className="w-full"
              >
                Submit Feedback
              </Button>
            </div>
          </Card>
        )}

        {/* Accuracy Note */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">AI Confidence: 94%</p>
              <p className="text-xs text-muted-foreground">
                This diagnosis is based on visual analysis. For severe cases, consult a local agricultural expert.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}