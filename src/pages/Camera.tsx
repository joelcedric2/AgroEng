import { useState, useRef } from "react";
import { PageLayout } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Camera as CameraIcon, Upload, RotateCcw, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScans } from "@/hooks/useScans";
import { useLanguage } from "@/contexts/LanguageContext";
import { SubscriptionLimits } from "@/components/SubscriptionLimits";

export default function Camera() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createScan } = useScans();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    try {
      // Create scan record in database
      const scanData = {
        image_url: capturedImage,
        plant_type: "Unknown", // Will be determined by AI
        issue_detected: "Processing...",
        severity: "medium" as const,
        confidence_score: 0
      };
      
      const scan = await createScan(scanData);
      
      // Simulate AI processing (replace with real AI API call)
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/diagnosis', { 
          state: { 
            scanId: scan?.id,
            image: capturedImage,
            plant: "Tomato",
            issue: "Leaf Blight (Fungal)",
            cause: "Caused by overwatering and poor ventilation"
          }
        });
      }, 3000);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isProcessing) {
    return (
      <PageLayout title="Analyzing Image" showNavigation={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-gentle">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Analyzing Your Plant</h2>
              <p className="text-muted-foreground">
                Our AI is examining the image for diseases, pests, and health indicators...
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">✓ Image uploaded successfully</div>
              <div className="text-sm text-muted-foreground">✓ Plant detected</div>
              <div className="text-sm text-muted-foreground">⏳ Running health analysis...</div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Plant Camera" showNavigation={true}>
      <div className="p-4 space-y-6">
        {!capturedImage ? (
          <>
            {/* Camera Instructions */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <CameraIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Take a Clear Photo</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Make sure the leaf or plant is well-lit and the issue is clearly visible. 
                    Hold your phone steady for the best results.
                  </p>
                </div>
              </div>
            </Card>

            {/* Camera Viewfinder Simulation */}
            <Card className="aspect-square bg-muted/20 border-2 border-dashed border-primary/30 flex items-center justify-center">
              <div className="text-center space-y-4">
                <CameraIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Camera viewfinder</p>
                <p className="text-xs text-muted-foreground px-4">
                  Position your plant in the center of the frame
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-semibold"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraIcon className="mr-2 h-6 w-6" />
                Capture Photo
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-12"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload from Gallery
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />
          </>
        ) : (
          <>
            {/* Captured Image Preview */}
            <Card className="overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured plant" 
                className="w-full aspect-square object-cover"
              />
            </Card>

            {/* Image Actions */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-semibold"
                onClick={processImage}
              >
                <CheckCircle className="mr-2 h-6 w-6" />
                Analyze This Image
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-12"
                onClick={retakePhoto}
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Retake Photo
              </Button>
            </div>

            {/* Tips for better results */}
            <Card className="p-4 bg-warning/5 border-warning/20">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-warning/20 rounded-full flex-shrink-0">
                  <span className="text-xs">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-warning mb-1">Pro Tip</h4>
                  <p className="text-xs text-muted-foreground">
                    For best results, make sure the affected area is clearly visible and well-lit. 
                    Avoid shadows and blur.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
}