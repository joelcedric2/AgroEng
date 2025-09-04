import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Calendar, ShoppingCart, CheckCircle, AlertCircle, Leaf, Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Solutions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { plant = "Tomato", issue = "Leaf Blight (Fungal)" } = location.state || {};

  const handleSaveSolution = () => {
    toast({
      title: "Solution Saved!",
      description: "Treatment plan has been saved to your history.",
    });
  };

  return (
    <PageLayout title="Treatment Solutions" showNavigation={true}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <Card className="p-6 text-center bg-gradient-to-br from-success/10 to-primary/10">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Treatment Plan</h2>
            <p className="text-muted-foreground">{plant} - {issue}</p>
          </div>
        </Card>

        {/* Short-term Solutions */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-warning/10 rounded-full">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <h3 className="text-lg font-semibold">Immediate Actions (1-2 days)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-success/20 rounded-full mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Remove Infected Leaves</p>
                <p className="text-sm text-muted-foreground">
                  Cut and dispose of all affected leaves to prevent spread. Clean tools with alcohol between cuts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-success/20 rounded-full mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Apply Organic Fungicide</p>
                <p className="text-sm text-muted-foreground">
                  Spray with neem oil or copper-based fungicide in early morning or evening.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-success/20 rounded-full mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Improve Air Circulation</p>
                <p className="text-sm text-muted-foreground">
                  Space plants further apart and remove lower leaves touching the ground.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Long-term Solutions */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Prevention & Long-term Care</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/20 rounded-full mt-1">
                <Leaf className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Adjust Watering Schedule</p>
                <p className="text-sm text-muted-foreground">
                  Water at soil level in early morning. Avoid watering leaves directly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/20 rounded-full mt-1">
                <Leaf className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Soil Management</p>
                <p className="text-sm text-muted-foreground">
                  Add organic compost and ensure proper drainage to strengthen plant immunity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-primary/20 rounded-full mt-1">
                <Leaf className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Crop Rotation</p>
                <p className="text-sm text-muted-foreground">
                  Plan to rotate with non-solanaceous crops next season to break disease cycle.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Local Remedies */}
        <Card className="p-6 bg-gradient-to-br from-success/5 to-primary/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-success/10 rounded-full">
              <Sprout className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Local Remedies</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-success/20 rounded-full mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Neem Oil Solution</p>
                <p className="text-sm text-muted-foreground">
                  Mix 2 tablespoons of neem oil with 1 liter of water. Spray in early morning or evening.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-success/20 rounded-full mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Ash & Pepper Solution</p>
                <p className="text-sm text-muted-foreground">
                  Mix wood ash with ground pepper and water to create natural pest deterrent spray.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-success/20 rounded-full mt-1">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium">Improve Plant Spacing</p>
                <p className="text-sm text-muted-foreground">
                  Space plants 30-45cm apart to reduce humidity and improve air circulation naturally.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Suggestions */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-success/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-full">
              <ShoppingCart className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Recommended Products</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div>
                <p className="font-medium">Neem Oil - 100ml</p>
                <p className="text-sm text-muted-foreground">Organic fungicide & pesticide</p>
              </div>
              <Button variant="outline" size="sm">
                $8.99
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div>
                <p className="font-medium">Copper Sulfate Spray</p>
                <p className="text-sm text-muted-foreground">Preventive fungicide</p>
              </div>
              <Button variant="outline" size="sm">
                $12.50
              </Button>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-semibold"
            onClick={handleSaveSolution}
          >
            <CheckCircle className="mr-2 h-6 w-6" />
            Save Treatment Plan
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
              onClick={() => navigate('/history')}
              className="h-12"
            >
              View History
            </Button>
          </div>
        </div>

        {/* Progress Tracking */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-warning" />
            <div>
              <p className="text-sm font-medium">Treatment Progress</p>
              <p className="text-xs text-muted-foreground">
                Check your plant in 3-5 days. Take another photo to track improvement.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}