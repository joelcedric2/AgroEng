import { useState, useEffect } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Camera, ChevronRight, Lightbulb, Cherry, Wheat, Carrot, Leaf, BarChart3, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useScans } from "@/hooks/useScans";

const quickTips = [
  "Avoid watering leaves to prevent fungal infections.",
  "Rotate your crops every season for better soil health.",
  "Check plants early morning for pest activity.",
  "Ensure good air circulation between plants.",
  "Water deeply but less frequently for stronger roots."
];

export default function Home() {
  const navigate = useNavigate();
  const [currentTip, setCurrentTip] = useState(0);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { scans } = useScans();

  const userName = profile?.full_name || user?.email?.split('@')[0] || "Farmer";
  const latestScan = scans[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % quickTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout title="AgroEng AI" showProfile={true}>
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, Farmer {userName}!
          </h2>
          <p className="text-muted-foreground">
            Ready to check your crops today?
          </p>
        </div>

        {/* Main Action Button */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Camera className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">Diagnose Your Plants</h3>
            <p className="text-muted-foreground">
              Take a photo to identify diseases and get treatment recommendations
            </p>
            <Button 
              onClick={() => navigate('/camera')}
              size="lg" 
              className="w-full h-14 text-lg font-semibold"
            >
              <Camera className="mr-2 h-6 w-6" />
              Take a Picture
            </Button>
          </div>
        </Card>

        {/* Last Diagnosis Summary */}
        {latestScan ? (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  {latestScan.plant_type === 'Tomato' ? (
                    <Cherry className="h-6 w-6 text-success" />
                  ) : latestScan.plant_type === 'Maize' ? (
                    <Wheat className="h-6 w-6 text-success" />
                  ) : latestScan.plant_type === 'Cassava' ? (
                    <Carrot className="h-6 w-6 text-success" />
                  ) : (
                    <Leaf className="h-6 w-6 text-success" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">Last Diagnosis</h4>
                  <p className="text-sm text-muted-foreground">
                    {latestScan.plant_type} - {latestScan.issue_detected || "Healthy"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(latestScan.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/history')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-muted/20 border-dashed">
            <div className="text-center py-4">
              <h4 className="font-semibold mb-2">No scans yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Take your first plant photo to get started
              </p>
              <Button onClick={() => navigate('/camera')} size="sm">
                Start Scanning
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Tips Carousel */}
        <Card className="p-4 bg-gradient-to-r from-accent/5 to-primary/5">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-warning/20 rounded-full flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-warning" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-2">Daily Tip</h4>
              <p className="text-sm text-muted-foreground leading-relaxed animate-fade-in">
                {quickTips[currentTip]}
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-1">
            {quickTips.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentTip ? 'bg-warning scale-125' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col space-y-2"
            onClick={() => navigate('/history')}
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-sm">View History</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col space-y-2"
            onClick={() => navigate('/tips')}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-sm">Learn Tips</span>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}