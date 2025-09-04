import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Loader2, Upload } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const CameraCapture = ({ onCapture, loading = false, disabled = false }: CameraCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Call parent handler
      onCapture(file);
    }
  };

  const resetCapture = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {preview ? (
            <div className="relative">
              <img 
                src={preview} 
                alt="Captured plant" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-sm mb-2">Plant image captured</p>
                  {loading && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No image captured</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {!preview ? (
          <>
            <Button
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || disabled}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Camera className="w-5 h-5 mr-2" />
              )}
              Take Photo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || disabled}
            >
              <Upload className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={resetCapture}
            disabled={loading}
            className="flex-1"
          >
            Take Another
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};